import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../functions";
import { LoginProps } from "../interfaces";

const Signup: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const body = {
    user: { username: username, password: password },
  };

  const url = "http://localhost:3000/signup";
  const handleLogin = () => {
    sendRequest(url, "POST", body)
      .then((res) => {
        const token = res.token;
        console.log("Login successful. Token:", token);
        localStorage.setItem("token", token);
        onLogin();
        navigate("/posts");
      })
      .catch((err) => {
        console.error("Signup failed:", err);
      });
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
