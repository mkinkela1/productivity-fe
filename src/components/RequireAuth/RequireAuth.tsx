import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/contexts/AuthContext";
import { useServiceWorker } from "src/contexts/ServiceWorkerContext";
import { isNotNullOrUndefined } from "src/utils/helpers";

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const { currentUser, isLoadingCurrentUser } = useAuth();
  const { isSwRegistered } = useServiceWorker();

  if (
    isNotNullOrUndefined(currentUser) ||
    isLoadingCurrentUser ||
    !isSwRegistered
  )
    return children;

  return <Navigate to="/login" />;
};

export default RequireAuth;
