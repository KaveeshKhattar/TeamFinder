import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { useAdminAccess } from "../hooks/useAdminAccess";

function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default AdminRouteGuard;
