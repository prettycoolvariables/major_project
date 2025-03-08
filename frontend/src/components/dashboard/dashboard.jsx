import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard = ({ data }) => {
  console.log("kitti",data);

const accident=data.map((incident, index) =>{
  return(
    <div key={index}>
      <br></br>
            <strong>{incident.anomaly_type}</strong>
            <br />
            {incident.date_time}, 
            {incident.geolocation}
          </div>
  )
})
console.log("sadanam",accident)




  return (
    <div className="dashboard">
      <div className="dtitle"><h2>Dashboard</h2></div>
      
      <div className="nav">
        <Link to="/install" className="nav-item">
          INSTALLATIONS
        </Link>
        <Link to="/history" className="nav-item">
          HISTORY
        </Link>
        <Link to="/" className="nav-item">
          LOGOUT
        </Link>
      </div>

      <div className="accidents">{accident}</div>
    </div>
  );
};

export default Dashboard;



