import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import routes, { TRoute } from '../pages/components/routes';
import { Key } from 'react';
import MainLayout from '../pages/components/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ErrorPage from '../pages/ErrorPages';
import EstadoEnvio from '../pages/estadoEnvio';
import CarritoCompras from '../pages/carritoCompras';
import AllListProducts from '../pages/all_list_product';

export default function AppRouters() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route path='/estado' element={<EstadoEnvio />} />
        <Route path='/carrito' element={<CarritoCompras onClose={() => {}} productos={[]} />} />
        <Route path='/all_list_products' element={<AllListProducts />} />
        <Route path='/' element={<Navigate to="/admin/home" />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/admin/*' element={<MainLayout />}>
          {routes.map((route: TRoute, index: Key) => {
            const fullPath = route.path.startsWith('/') ? route.path.substring(1) : route.path;
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
          <Route path='*' element={<ErrorPage />} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}