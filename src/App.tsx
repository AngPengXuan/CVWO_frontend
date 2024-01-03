import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Protected from "./pages/authentication/Protected";
import Login from "./pages/authentication/Login";
import Posts from "./pages/thread/Posts";
import NewPost from "./pages/thread/NewPost";
import { useEffect, useState } from "react";
import Signup from "./pages/authentication/Signup";
import Post from "./pages/thread/Post";
import { LogoutProps } from "./components/interfaces";

function App() {
  const [loggedIn, setLoggedIn] = useState("token" in localStorage);

  const handleLogin = () => {
    setLoggedIn("token" in localStorage);
  };

  return (
    <BrowserRouter>
      <Navbar login={loggedIn} />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/logout"
          element={<LogoutFunction onLogout={handleLogin} />}
        />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
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

const LogoutFunction: React.FC<LogoutProps> = ({ onLogout }: LogoutProps) => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    onLogout();

    navigate("/posts");
  }, [onLogout, navigate]);
  return null;
};

export default App;
