import React from "react";
import { Link } from "react-router-dom";
import styles from "./dashboard.css";
import bgImage from "../../assets/bg.png";

const Dashboard = () => {

    return (
        <div className={styles["history-page"]}>
            {/* Background and Overlay */}
            <div className={styles["background-overlay"]}>
                <img
                    className={styles["background-image"]}
                    alt="History Background"
                    src={bgImage}
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.style.backgroundColor = "#000";
                    }}
                />
                <div className={styles["overlay"]} />
            </div>

            {/* Title */}
            <div className={styles["title-text"]}>HISTORY</div>

            {/* Navigation Bar */}
            <div className={styles["nav"]}>
                <Link to="/installations" className={styles["nav-item"]}>
                    INSTALLATIONS
                </Link>
                <Link to="/history" className={styles["nav-item"]}>
                    HISTORY
                </Link>
                <Link to="/dashboard" className={styles["nav-item"]}>
                    DASHBOARD
                </Link>
            </div>

            {/* Locations List */}
            <div className={styles["history"]}>
                {incidentData.map((incident, index) => (
                    <div key={index}>
                        <strong>{incident.location}</strong><br />
                        {incident.details}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;