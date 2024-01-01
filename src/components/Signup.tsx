import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/signup", {
        username,
        password,
      });
      const token = response.data.token;
      // Store token in local storage or state for future use
      console.log("Login successful. Token:", token);
      localStorage.setItem("token", token);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Signup;
