import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import routes from '../pages/components/routes';
import { ComponentType, Key } from 'react';
import MainLayout from '../pages/components/MainLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EstadoEnvio from '../pages/estadoEnvio';
import CarritoCompras from '../pages/carritoCompras';

export default function AppRouters() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainLayout />} />
        <Route path='/estado' element={<EstadoEnvio />} />
        <Route path='/carrito' element={<CarritoCompras />} />
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />
        <Route path='/admin/*' element={<MainLayout />}>
        {routes.map((route: { isPrivate?: boolean; path: string; component: ComponentType<any>; layout?: string }, index: Key) => {
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
        </Route>
      </Routes>
    </Router>
  );
}