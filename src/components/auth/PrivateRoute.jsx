import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserPreferences } from "../../utils/api";

const PrivateRoute = ({ children, blockWhenLoggedIn = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPreferences, setHasPreferences] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setIsAuthenticated(true);

      // Fetch user preferences
      getUserPreferences(userId)
        .then((preferences) => {
          setHasPreferences(!!preferences?.mood || !!preferences?.genre);
          setIsLoading(false);
        })
        .catch(() => {
          setHasPreferences(false);
          setIsLoading(false);
        });
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Replace with a loader component
  }

  if (blockWhenLoggedIn && isAuthenticated && hasPreferences) {
    // Redirect if logged in and has preferences
    return <Navigate to="/recommendations" replace />;
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
