import React, { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sendRequest } from "../../components/Functions";
import { backendLinks } from "../../utils/BackendConfig";

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null to represent initial loading state
  const token = localStorage.getItem("token");

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
  }, [token]); // Run this effect whenever the token changes

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
