import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = ({alertdata}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };
console.log("alert",alertdata)
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
        <button onClick={handleLogout} className="logoutbutton">
        LOGOUT
      </button>
      </div>
      <h2>{alertdata}</h2>

 
    </div>
  );
};

export default Dashboard;



