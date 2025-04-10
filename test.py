import requests

# Define the URL of the Flask API
url = "http://127.0.0.1:5000/receive"

# The string you want to send
data = {"message": "Hello from test.py"}

# # Send the POST request
response = requests.post(url, json=data)

# # Print the server's response
print(response.json())