import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginProps } from "../../components/Interfaces";
import Authentication from "../../components/Authentication";
import { sendRequest } from "../../components/Functions";
import { Grid } from "@mui/material";
import { backendLinks } from "../../utils/BackendConfig";

// Login component
const Login: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const usernameState = useState("");
  const passwordState = useState("");
  const [username] = usernameState;
  const [password] = passwordState;
  const navigate = useNavigate();

  // Sets the JSON body
  const body = {
    user: { username: username, password: password },
  };

  // Sends POST request with JSON body from above
  const handleLogin = () => {
    sendRequest(backendLinks.login, "POST", body)
      .then((res) => {
        const token = res.token;
        console.log("Login successful. Token:", token);
        localStorage.setItem("token", token);
        onLogin();
        navigate("/threads");
      })
      .catch((err) => {
        console.error("Login failed:", err);
      });
  };

  // Creates the register link
  const gridItem = (
    <Grid item>
      <Link to="/register">Don't have an account? Register</Link>
    </Grid>
  );

  // Login page
  return (
    <Authentication
      handle={handleLogin}
      usernameState={usernameState}
      passwordState={passwordState}
      text="Login"
      gridItem={gridItem}
    ></Authentication>
  );
};

export default Login;
