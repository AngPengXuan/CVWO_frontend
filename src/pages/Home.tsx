import { Box, Button, Container, CssBaseline, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const backgroundStyle = {
    backgroundImage:
      'url("https://cdn.pixabay.com/photo/2017/01/16/19/40/mountains-1985027_1280.jpg")',
    backgroundSize: "cover", // Adjust to your needs
    backgroundPosition: "center", // Adjust to your needs
    height: "100vh", // Set the height of the container
  };
  const text = "Welcome to the forum! The sky's the limit!";
  const navigate = useNavigate();
  return (
    <div
      style={{
        ...backgroundStyle,
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
    >
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha (fourth) parameter as needed
            padding: 3, // Add padding to make the content stand out
            borderRadius: 4, // Optional: Add border-radius for rounded corners
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            {text}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                navigate("/register");
              }}
            >
              {"Register"}
            </Button>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              or
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                navigate("/login");
              }}
            >
              {"Login"}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
