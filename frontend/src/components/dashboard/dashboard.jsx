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

const Dashboard = ({ alertdata, data }) => {
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
    { name: "Edapally", value: 20 },
    { name: "Aluva", value: 5 },
    
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  // Process data to count accidents per location
  const getAccidentCounts = () => {
    const counts = {};
    
    data.forEach(item => {
      const location = item.geolocation.toLowerCase();
      counts[location] = (counts[location] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      value,
    }));
  };

  const accidentData = getAccidentCounts()
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
        <PieChart width={600} height={300}>
        <Pie
            data={accidentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100)}%`}
          >
            {accidentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* <Tooltip 
            formatter={(value, name, props) => [
              value, 
              `${name} (${((props.payload.percent || 0) * 100)}%)`]}
          /> */}
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default Dashboard;
