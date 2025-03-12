import React from "react";
import { Link } from "react-router-dom";
import "./history.css";
import { useState, useEffect, useRef } from "react";

const History = ({ data }) => {
  console.log("kitti", data);
  const [ddtoggled, setddtoggled] = useState(false);
  const accident = data.map((incident, index) => {
    return (
      <div key={index}>
        <br></br>
        <strong>{incident.anomaly_type}</strong>
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
        <Link to="/" className="nav-item">
          LOGOUT
        </Link>
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
