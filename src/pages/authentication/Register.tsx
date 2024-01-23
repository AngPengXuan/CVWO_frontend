import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRequest } from "../../components/Functions";
import { LoginProps } from "../../components/Interfaces";
import Authentication from "../../components/Authentication";
import { Grid } from "@mui/material";
import { backendLinks } from "../../utils/BackendConfig";

const Register: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
  const usernameState = useState("");
  const passwordState = useState("");
  const [username] = usernameState;
  const [password] = passwordState;
  const navigate = useNavigate();

  const body = {
    user: { username: username, password: password },
  };
  const handleLogin = () => {
    sendRequest(backendLinks.register, "POST", body)
      .then((res) => {
        const token = res.token;
        console.log("Register successful. Token:", token);
        localStorage.setItem("token", token);
        onLogin();
        navigate("/threads");
      })
      .catch((err) => {
        alert("Username was used");
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
