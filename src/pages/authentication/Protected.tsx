import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sendRequest } from "../../components/Functions";
import { backendLinks } from "../../utils/BackendConfig";

// Sets the
interface ProtectedProps {
  children: ReactNode;
}

// Interface for Protected properties
const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null to represent initial loading state
  const token = localStorage.getItem("token");

  // Validates the token everytime it changes
  useEffect(() => {
    if (token) {
      sendRequest(backendLinks.validate_token, "POST", { token })
        .then(() => setIsAuthenticated(true))
        .catch(() => {
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // Checks if authenticated
  if (isAuthenticated === null) {
    // If authentication status is still loading, display a loading indicator or nothing
    return null; // or loading spinner, etc.
  } else if (!isAuthenticated) {
    // If not authenticated, redirect to the specified route
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
};

export default Protected;
