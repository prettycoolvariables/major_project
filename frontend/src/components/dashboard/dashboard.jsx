// import React from "react";
// import { Link } from "react-router-dom";
// import "./dashboard.css";
// import { useNavigate } from "react-router-dom";

// const Dashboard = ({alertdata}) => {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     navigate("/");
//   };
// console.log("alert",alertdata)
//   return (
//     <div className="dashboard">
//       <div className="dtitle"><h2>Dashboard</h2></div>
      
//       <div className="nav">
//         <Link to="/installations" className="nav-item">
//           INSTALLATIONS
//         </Link>
//         <Link to="/history" className="nav-item">
//           HISTORY
//         </Link>
//         <button onClick={handleLogout} className="logoutbutton">
//         LOGOUT
//       </button>
//       </div>
//       <h2>{alertdata}</h2>

 
//     </div>
//   );
// };

// export default Dashboard;


import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./dashboard.css";

const Dashboard = ({ alertdata }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  console.log("alert", alertdata);

  // Sample data for anomalies
  const anomalyData = [
    { name: "Kakkanad", value: 10 },
    { name: "Thripunithura", value: 15 },
    { name: "Kochi", value: 20 },
    { name: "Aluva", value: 5 },
    
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="dashboard">
      <div className="dtitle">
        <h2>Dashboard</h2>
      </div>

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
      <br></br>
<div className="alertnotif">
      <h2>{alertdata ? alertdata : "No alerts currently"}</h2>
</div>
      {/* Pie Chart for Anomalies */}
      <div className="chart-container">
        <h3>Anomalies Detected</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={anomalyData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {anomalyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
