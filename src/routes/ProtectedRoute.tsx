import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/stores/auth.store";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: "Client" | "Lawyer";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAuthenticated) {
    console.log("Fuck it");
    return <Navigate to="/" replace />;
  }
  if (requiredUserType && user?.userType !== requiredUserType) {
    return <Navigate to="/forbidden" replace />;
  }
  return <>{children}</>;
};
