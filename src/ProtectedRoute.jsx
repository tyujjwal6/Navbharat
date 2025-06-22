import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';




const ProtectedRoutes = () => {
    const token = localStorage.getItem("isAuthenticated")
    const token1 = localStorage.getItem("userdata")

    // Only check for user once loading is complete
    if (!token) {
        localStorage.removeItem("isAuthenticated"); // Clear expired token
        return <Navigate to="/login" replace />; // Redirect to login
      }

    // If user is authenticated, render the protected content
    return (
        <>
            <Outlet />  {/* Outlet renders the nested/protected components */}
        </>
    );
};

export default ProtectedRoutes;