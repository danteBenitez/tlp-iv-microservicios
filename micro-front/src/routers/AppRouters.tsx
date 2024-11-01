import { Key } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import MainLayout from "../pages/components/MainLayout";
import routes, { TRoute } from "../pages/components/routes";
import ErrorPage from "../pages/ErrorPages";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoutes";

export default function AppRouters() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/home" />} />
        <Route path="/" element={<MainLayout />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/admin/*" element={<MainLayout />}>
          {routes.map((route: TRoute, index: Key) => {
            const fullPath = route.path.startsWith("/")
              ? route.path.substring(1)
              : route.path;
            if (route.isPrivate) {
              return (
                <Route
                  key={index}
                  path={fullPath}
                  element={<PrivateRoute component={route.component} />}
                />
              );
            }
            return (
              <Route
                key={index}
                path={fullPath}
                element={<route.component />}
              />
            );
          })}
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
