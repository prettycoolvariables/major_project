import React from "react";
import { Link } from "react-router-dom";
import "./history.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const History = ({ data }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };
  console.log("kitti", data);
  const [ddtoggled, setddtoggled] = useState(false);
  const accident = data.map((incident, index) => {
    return (
      <div key={index}>
        <br></br>
        <strong>Anomaly value:{incident.anomaly_type}</strong>
        <br />
        {incident.date_time},{incident.geolocation}
      </div>
    );
  });
  console.log("sadanam", accident);

  return (
    <div className="history">
      <div className="htitle">
        <h2>History</h2>
      </div>

      <div className="nav">
        <Link to="/installations" className="nav-item">
          INSTALLATIONS
        </Link>
        <Link to="/dashboard" className="nav-item">
          DASHBOARD
        </Link>
        <button onClick={handleLogout} className="logoutbutton">
        LOGOUT
      </button>
      </div>

      <div className="viewall">
        <button
          className="toggle"
          onClick={() => {
            setddtoggled(!ddtoggled);
          }}
        >
          View History
        </button>
        <div className={`accidents ${ddtoggled ? "show" : "noshow"}`}>
                {accident}
            </div>
      </div>
    </div>
  );
};

export default History;
