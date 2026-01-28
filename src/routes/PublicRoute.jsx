// src/routes/PublicRoute.jsx

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    // Logged in → redirect to home/dashboard
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
