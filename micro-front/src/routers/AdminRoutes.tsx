import { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

interface TAdminRouteProps {
  component: ComponentType<any>;
  [key: string]: any;
}

export default function AdminRoutes({
  component: Component,
  ...rest
}: TAdminRouteProps) {
  const { loadingAuthentication, isAdmin, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (loadingAuthentication && !isAuthenticated) {
    return null;
  }

  return isAuthenticated && isAdmin ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/home" />
  );
}
