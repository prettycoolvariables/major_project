import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      // Parse the response JSON
      const data = await response.json();
      // Check if the login was successful
      if (response.ok) {
        // Save the JWT token to localStorage (or state)
        localStorage.setItem("access_token", data.access_token);
        console.log(data.access_token)
        // Redirect to the dashboard
        navigate("/dashboard");
      } else {
        // Display an error message if login failed
        alert(data.msg);
      }
    } 
    catch (err) {
      console.error("login error:", err);
    }
  };

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const navigate = useNavigate();

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   if (email === "authority" && password === "123") {
  //     navigate("/dashboard");
  //   } else {
  //     alert("Invalid email or password!");
  //   }
  // };

  return (
    <div className="login">
      <div className="loginCard">
        <h2 className="ltitle">SoundTrace</h2>
        <form className="lform" onSubmit={handleLogin}>
          <input
            type="User name"
            placeholder="User name"
            className="linput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="linput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="lbutton">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
