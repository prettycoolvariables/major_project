import React from "react";
import { Link } from "react-router-dom";
import "./install.css";

const Install = () => {

  return (
    <div className="installs">
      <div className="ititle">
        <h2>Installations</h2>  </div>
        <div className="nav">
        <Link to="/dashboard" className="nav-item">
          DASHBOARD
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

export default Install;
