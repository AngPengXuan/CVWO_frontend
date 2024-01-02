import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Protected from "./components/authentication/Protected";
import Login from "./components/authentication/Login";
import Posts from "./components/thread/Posts";
import NewPost from "./components/thread/NewPost";
import { useEffect, useState } from "react";
import Signup from "./components/authentication/Signup";
import Post from "./components/thread/Post";
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
