import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("access_token");

    // Redirect to the login page
    navigate("/");
  };

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
        <button onClick={handleLogout} className="logout-button">
        LOGOUT
      </button>
      </div>

 
    </div>
  );
};

export default Dashboard;



