import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Appbar";
import Protected from "./pages/authentication/Protected";
import Posts from "./pages/thread/Posts";
import NewPost from "./pages/thread/NewPost";
import { useEffect, useState } from "react";
import Post from "./pages/thread/Post";
import { LogoutProps } from "./components/interfaces";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";

function App() {
  const [loggedIn, setLoggedIn] = useState("token" in localStorage);

  const handleLogin = () => {
    setLoggedIn("token" in localStorage);
  };

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    console.log(inputValue);
    setSearchValue(inputValue);
  };

  return (
    <BrowserRouter>
      <Navbar
        login={loggedIn}
        handleSearch={handleSearch}
        searchValue={searchValue}
      />
      <Routes>
        <Route path="/" element={<Posts searchValue={searchValue} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/logout"
          element={<LogoutFunction onLogout={handleLogin} />}
        />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/posts" element={<Posts searchValue={searchValue} />} />
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
