import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginProps } from "../../components/interfaces";
import Authentication from "../../components/Authentication";
import { sendRequest } from "../../components/functions";
import { Grid } from "@mui/material";

const Login: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const usernameState = useState("");
  const passwordState = useState("");
  const [username] = usernameState;
  const [password] = passwordState;
  const navigate = useNavigate();

  const url = "http://localhost:3000/login";

  const body = {
    user: { username: username, password: password },
  };

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
        console.error("Login failed:", err);
      });
  };
  const gridItem = (
    <Grid item>
      <Link to="/register">Don't have an account? Register</Link>
    </Grid>
  );

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
