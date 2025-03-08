import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Add authentication logic here
    if (email === "authority" && password === "123") {
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };




  
  return (
    <div className="login">
      <div className="loginCard">
        <h2 className="ltitle">SoundTrace</h2>
        <form className="lform" onSubmit={handleLogin}>
          <input
            type="User name"
            placeholder="User name"
            className="linput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
