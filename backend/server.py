from flask import Flask, request, jsonify, Response, stream_with_context
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token
import datetime
from flasgger import Swagger
from flask_cors import CORS 
from datetime import timedelta
import requests

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///anomaly.db'  
app.config['JWT_SECRET_KEY'] = 'rajagiri'

db = SQLAlchemy(app)
jwt = JWTManager(app)
swagger = Swagger(app)
cors=CORS(app)

message=None
av=0
geo=None
date=None
token=None



class AnomalyMeta(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    anomaly_type = db.Column(db.Integer, nullable=False)
    geolocation = db.Column(db.String(200), nullable=False)
    date_time = db.Column(db.DateTime, nullable=False)

    def get_val(self):
        return {
            'id': self.id,
            'anomaly_type': self.anomaly_type,
            'geolocation': self.geolocation,
            'date_time': self.date_time.isoformat()
        }
    
with app.app_context():
    db.create_all()


@app.route('/receive', methods=['POST'])
def receive_data():
    data = request.json  # Get JSON data from the request
    global message,geo,av,date
    message = data.get("message", "No message received")
    av = data.get("anomaly_type", "No message received")
    geo = data.get("geolocation", "No message received")
    date = data.get("date_time", "No message received")
    print("aaaaa\n\n",av)
    return jsonify({"status": "success", "received_string": message})

@app.route('/stream')
def stream():
    def event_stream():
        url = "http://127.0.0.1:5000/add_anomaly"
        headers = {"accept": "application/json","Content-Type": "application/json"}
        global message,av,data,geo
        print(message)
        if message:
            yield f"data: {message}\n\n"
            data = {
                "anomaly_type": av,
                "date_time": "2025-04-02 08:49:23",
                "geolocation": geo
            }
            requests.post(url, headers=headers, json=data)
            message = None  # Clear the alert after sending
    return Response(event_stream(), content_type='text/event-stream')

@app.route('/login', methods=['POST'])
def login():
    """
    Login 
    ---
    parameters:
      - in: body
        name: credentials
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login successful
        schema:
          type: object
          properties:
            access_token:
              type: string
      401:
        description: Invalid username or password
    """
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username != 'authority' or password != '123':  
        return jsonify({'msg': 'wrong username or password'}), 401
    access_token = create_access_token(identity=username, expires_delta=timedelta(hours=1))
    global token
    token=access_token
    return jsonify(access_token=access_token)


@app.route('/add_anomaly', methods=['POST'])
# @jwt_required()
def create_anomaly():
    """
    Add a new Anomaly
    ---
    parameters:
      - in: body
        name: anomaly
        required: true
        schema:
          type: object
          properties:
            anomaly_type:
              type: integer
            geolocation:
              type: string
            date_time:
              type: string
              format: date-time
    responses:
      201:
        description: Anomaly added successfully
      400:
        description: Invalid input data
    """
    try:
        data = request.get_json()
        anomaly = AnomalyMeta(
            anomaly_type=data['anomaly_type'],
            geolocation=data['geolocation'],
            date_time=datetime.datetime.strptime(data['date_time'], '%Y-%m-%d %H:%M:%S')
        )
        db.session.add(anomaly)
        db.session.commit()
        return jsonify({'msg': 'Anomaly added successfully'}), 201
    except Exception as e:
        return jsonify({'msg': 'Invalid input data', 'error': str(e)}), 400

@app.route('/get_all', methods=['GET'])
# @jwt_required()
def get_accidents():
    """
    Get all Anomalies
    ---
    responses:
      200:
        description: A list of Anomalies
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              anomaly_type:
                type: integer
              geolocation:
                type: string
              date_time:
                type: string
                format: date-time
    """
    anomalies = AnomalyMeta.query.all()
    # current_user = get_jwt_identity()
    return jsonify([anomaly.get_val() for anomaly in anomalies])

@app.route('/anomaly/<int:anomaly_id>', methods=['GET'])
# @jwt_required()
def get_accident(anomaly_id):
    """
    Get an Anomaly by ID
    ---
    parameters:
      - name: anomaly_id
        in: path
        type: integer
        required: true
    responses:
      200:
        description: The Anomaly with the given ID
        schema:
          type: object
          properties:
            id:
              type: integer
            anomaly_type:
              type: integer
            geolocation:
              type: string
            date_time:
              type: string
              format: date-time
      404:
        description: Anomaly not found
    """
    anomaly = AnomalyMeta.query.get(anomaly_id)
    if anomaly:
        return jsonify(anomaly.get_val())
    else:
        return jsonify({'msg': 'Anomaly not found'}), 404

print(token)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)