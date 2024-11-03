import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ComponentType } from "react";
import { Navigate } from "react-router-dom";

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
    <Navigate to="/" />
  );
}
