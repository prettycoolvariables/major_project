import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";


const Dashboard = () => {

  return (
    <div className="dashboard">
      <div className="dtitle"><h2>Dashboard</h2></div>
      
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

 
    </div>
  );
};

export default Dashboard;



