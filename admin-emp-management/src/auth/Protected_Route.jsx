// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ isLoggedIn, children }) => {
//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }
//   // If logged in, show the requested page
//   return children;
// };

// export default ProtectedRoute;


import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isLoggedIn, requiredRole, permissionTitle, children }) => {
  
 
  const user = JSON.parse(localStorage.getItem("hrmsuser"));
  const module = JSON.parse(localStorage.getItem("module")) || [];
  const allowedRoles = [].concat(requiredRole);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }


  if (user?.superUser) {
    return children;
  }

  if (!allowedRoles.includes(user?.type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissionTitle) {
    const hasPermission = module.some(
      (item) =>
        item.title === permissionTitle &&
        item.permission?.toLowerCase() === "yes"
    );

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }


  return children;
};

export default ProtectedRoute;
