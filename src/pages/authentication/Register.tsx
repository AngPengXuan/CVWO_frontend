import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRequest } from "../../components/functions";
import { LoginProps } from "../../components/interfaces";
import Authentication from "../../components/Authentication";
import { Grid } from "@mui/material";

const Register: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const usernameState = useState("");
  const passwordState = useState("");
  const [username] = usernameState;
  const [password] = passwordState;
  const navigate = useNavigate();

  const body = {
    user: { username: username, password: password },
  };

  const url = "http://localhost:3000/signup";
  const handleLogin = () => {
    sendRequest(url, "POST", body)
      .then((res) => {
        const token = res.token;
        console.log("Register successful. Token:", token);
        localStorage.setItem("token", token);
        onLogin();
        navigate("/posts");
      })
      .catch((err) => {
        console.error("Signup failed:", err);
      });
  };

  const gridItem = (
    <Grid item>
      <Link to="/login">Already have an account? Login</Link>
    </Grid>
  );

  return (
    <Authentication
      handle={handleLogin}
      usernameState={usernameState}
      passwordState={passwordState}
      text="Register"
      gridItem={gridItem}
    ></Authentication>
  );
};

export default Register;
