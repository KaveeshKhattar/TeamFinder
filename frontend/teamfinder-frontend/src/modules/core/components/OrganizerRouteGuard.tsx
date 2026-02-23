import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useOrganizerAccess } from "../hooks/useOrganizerAccess";
import Loading from "./Loading";

function OrganizerRouteGuard({ children }: { children: ReactNode }) {
  const { isOrganizer, loading } = useOrganizerAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!isOrganizer) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default OrganizerRouteGuard;
