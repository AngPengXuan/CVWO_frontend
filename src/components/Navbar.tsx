import { Link } from "react-router-dom";

interface LoginProps {
  login: Boolean;
}

const Navbar: React.FC<LoginProps> = ({ login }: LoginProps) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/" style={{ padding: "10px" }}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" style={{ padding: "10px" }}>
                Profile
              </Link>
            </li>
            <li className="nav-item active">
              <Link to="/about" style={{ padding: "10px" }}>
                About
              </Link>
            </li>
            {!login && (
              <li className="nav-item active">
                <Link to="/login" style={{ padding: "10px" }}>
                  Login
                </Link>
              </li>
            )}
            {login && (
              <li className="nav-item active">
                <Link to="/logout" style={{ padding: "10px" }}>
                  Logout
                </Link>
              </li>
            )}

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Action
                </a>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
