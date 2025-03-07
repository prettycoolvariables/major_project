import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

const Dashboard = ({ data }) => {
  console.log(data);
  return (
    <div className="dashboard">
      <h2 className="dtitle">Dashboard</h2>

      <div className="nav">
        <Link to="/installations" className="nav-item">
          INSTALLATIONS
        </Link>
        <Link to="/history" className="nav-item">
          HISTORY
        </Link>
        <Link to="/" className="nav-item">
          LOGOUT
        </Link>
      </div>

      {/* Locations List */}
      <div className="locations">
        {data.map((incident, index) => (
          <div key={index}>
            <strong>{incident.location}</strong>
            <br />
            {incident.details}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
