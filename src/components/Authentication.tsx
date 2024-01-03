import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import React from "react";
import { handleKeypress } from "./functions";

// The Authentication page design is referenced from:
// https://medium.com/@prabhashi.mm/create-a-simple-react-app-typescript-with-login-register-pages-using-create-react-app-e5c12dd6db53

interface Props {
  handle: () => void;
  usernameState: [string, React.Dispatch<React.SetStateAction<string>>];
  passwordState: [string, React.Dispatch<React.SetStateAction<string>>];
  text: string;
  gridItem: JSX.Element;
}

const Authentication: React.FC<Props> = ({
  handle,
  usernameState,
  passwordState,
  text,
  gridItem,
}: Props) => {
  const [username, setUsername] = usernameState;
  const [password, setPassword] = passwordState;

  //   const handleKeypress = (e: React.KeyboardEvent, func: () => void) => {
  //     //it triggers by pressing the enter key
  //     if (e.key === "Enter") {
  //       func();
  //     }
  //   };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          mt: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">{text}</Typography>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={handleKeypress(handle)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handle}
          >
            {text}
          </Button>
          <Grid container justifyContent={"flex-end"}>
            {gridItem}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Authentication;
