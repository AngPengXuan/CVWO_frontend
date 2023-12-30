import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

type OnLoginFunction = () => void;

interface LoginProps {
  onLogin: OnLoginFunction;
}

const Login: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username,
        password,
      });
      const token = response.data.token;
      // Store token in local storage or state for future use
      console.log("Login successful. Token:", token);
      localStorage.setItem("token", token);
      onLogin();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
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

export default Login;
