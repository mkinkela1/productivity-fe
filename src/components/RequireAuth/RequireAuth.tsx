import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/contexts/AuthContext";
import { isNotNullOrUndefined } from "src/utils/helpers";

const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
  const { currentUser, isLoadingCurrentUser } = useAuth();
  if (isNotNullOrUndefined(currentUser) || isLoadingCurrentUser)
    return children;

  return <Navigate to="/login" />;
};

export default RequireAuth;
