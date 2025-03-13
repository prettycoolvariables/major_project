import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the user is authenticated (e.g., by checking for a token in localStorage)
  const isAuthenticated = localStorage.getItem("access_token");

  // If authenticated, render the child routes (e.g., Dashboard)
  // If not, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;