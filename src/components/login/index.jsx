import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Ensure your CSS file is correctly linked
import { useNavigate } from "react-router-dom";
import { BASE_URL, clientServer } from "../..";

export const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Optional: This ensures the animation only triggers once on mount
    document.body.style.overflow = "hidden"; // Disable scroll for better UX
    return () => {
      document.body.style.overflow = ""; // Restore default scroll on cleanup
    };
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        name,
        email,
        password,
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });
      setMessage(response.data.message);
      navigate("/home");
      localStorage.setItem("token", response.data.token);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container" key={isLogin ? "login" : "register"}>
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form>
        <p
          style={{
            textAlign: "center",
            color: "green",
          }}
        >
          {message}
        </p>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="btn">
          <button
            type="button"
            onClick={isLogin ? handleLogin : handleRegister}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
        <div>
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </span>
        </div>
      </form>
    </div>
  );
};
