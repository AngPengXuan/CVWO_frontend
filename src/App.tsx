import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Profile from "./components/Profile";
import About from "./components/About";
import Protected from "./components/Protected";
import Login from "./components/Login";
import Posts from "./components/Posts";
import NewPost from "./components/NewPost";
import { useEffect, useState } from "react";
import Signup from "./components/Signup";
import Post from "./components/Post";
function App() {
  const [loggedIn, setLoggedIn] = useState("token" in localStorage);

  // useEffect(() => {
  //   setLoggedIn("token" in localStorage);
  // }, []);

  const handleLogin = () => {
    setLoggedIn("token" in localStorage);
  };

  return (
    <BrowserRouter>
      <Navbar login={loggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/logout"
          element={<LogoutFunction onLogout={handleLogin} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:id" element={<Post />} />
        <Route
          path="/new_post"
          element={
            <Protected>
              <NewPost />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

type OnLogoutFunction = () => void;

interface LogoutProps {
  onLogout: OnLogoutFunction;
}

const LogoutFunction: React.FC<LogoutProps> = ({ onLogout }: LogoutProps) => {
  const navigate = useNavigate();
  // Call onLogout function when this component is rendered
  useEffect(() => {
    localStorage.removeItem("token");
    // Call onLogout function after rendering
    onLogout();

    // Navigate to a specific route after logout (if needed)
    navigate("/"); // Example: Navigate to the home page after logout
  }, [onLogout, navigate]);
  return null; // This component doesn't render anything
};

export default App;
