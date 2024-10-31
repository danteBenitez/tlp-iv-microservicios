import React, { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "./types";

interface PrivateRouteProps {
  component: ComponentType<any>;
  [key: string]: any;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isLoading = useSelector(
    (state: RootState) => state.auth.loadingAuthentication
  );

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/auth/login" />
  );
};

export default PrivateRoute;
