import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.css";
import bgImage from "../../assets/bg.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Add authentication logic here
        if (email === "test@example.com" && password === "password123") {
            // Redirect to Installations page on successful login
            navigate("/dashboard");
        } else {
            alert("Invalid email or password!");
        }
    };

    return (
        <div className={styles.login}>
            {/* Background and Overlay */}
            <div className={styles.overlapGroupWrapper}>
                <img
                    className={styles.backgroundImage}
                    alt="Background"
                    src={bgImage}
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
                <div className={styles.overlay}></div>
            </div>

            {/* Centered Login Card */}
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Log in</h2>
                <form className={styles.form} onSubmit={handleLogin}>
                    <input
                        type="User name"
                        placeholder="User name"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles.button}>
                        Log in
                    </button>
                </form>
                
            </div>
        </div>
    );
};

export default Login;