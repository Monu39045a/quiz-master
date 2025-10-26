import type React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ProtectedRoutesProps {
  allowedRoles: ("trainer" | "participant")[];
  children: React.ReactNode;
}

const ProtectedRoutes = ({ allowedRoles, children }: ProtectedRoutesProps) => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.user);
  console.log(
    "ProtectedRoutes - isLoggedIn:",
    isLoggedIn,
    "role:",
    role,
    "allowedRoles:",
    allowedRoles
  );
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
