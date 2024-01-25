import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRequest } from "../../components/Functions";
import { LoginProps } from "../../components/Interfaces";
import Authentication from "../../components/Authentication";
import { Grid } from "@mui/material";
import { backendLinks } from "../../utils/BackendConfig";

// Register component
const Register: React.FC<LoginProps> = ({ onLogin }: LoginProps) => {
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

  // Creates the login link
  const gridItem = (
    <Grid item>
      <Link to="/login">Already have an account? Login</Link>
    </Grid>
  );

  // Register page
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
