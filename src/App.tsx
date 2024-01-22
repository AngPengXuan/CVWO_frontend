import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import Navbar from "./components/Appbar";
import Protected from "./pages/authentication/Protected";
import Posts from "./pages/thread/Posts";
import NewPost from "./pages/thread/NewPost";
import { useEffect, useState } from "react";
import Post from "./pages/thread/Post";
import { LogoutProps } from "./components/Interfaces";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import { SelectChangeEvent } from "@mui/material";

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

  const sortOptions = [
    "date \u2193",
    "date \u2191",
    "rating \u2193",
    "rating \u2191",
  ];
  //sets default value as da (date ascending)
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const handleSort = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <BrowserRouter>
      <Navbar
        login={loggedIn}
        handleSearch={handleSearch}
        searchValue={searchValue}
        sortOption={sortOption}
        handleSort={handleSort}
        sortOptions={sortOptions}
        currentRoute={window.location.pathname}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Posts
              searchValue={searchValue}
              sortOption={sortOption}
              sortOptions={sortOptions}
            />
          }
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/logout"
          element={<LogoutFunction onLogout={handleLogin} />}
        />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route
          path="/posts"
          element={
            <Posts
              searchValue={searchValue}
              sortOption={sortOption}
              sortOptions={sortOptions}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <Post
              searchValue={searchValue}
              sortOption={sortOption}
              sortOptions={sortOptions}
            />
          }
        />
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
