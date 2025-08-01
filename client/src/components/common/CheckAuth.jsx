import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  //if user is authenticated take to home page, if its admin take to admin dashboard
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  const protectedRoutes = ["/admin", "/shop/checkout", "/shop/account"];
  const isProtected = protectedRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  if (!isAuthenticated && isProtected) {
    return <Navigate to="/auth/login" replace />;
  }

  return <div>{children}</div>;
};

export default CheckAuth;
