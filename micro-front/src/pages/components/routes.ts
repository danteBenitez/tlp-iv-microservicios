import { ComponentType } from 'react';
import { FaEdit, FaGlobe, FaHtml5, FaKey, FaList, FaUser, FaUserCircle } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import Categoria from '../categoria/Categoria';
import Home from '../Home';
import Login from '../Login';
import Producto from '../productos/Producto';
import Productos from '../productos/Productos';
import { ProductosCreate } from '../productos/ProductosCreate';
import ProveedoresIndex from '../proveedores/Proveedores';
import Register from '../Register';
import Profile from '../users/profile';
import Users from '../users/user';

export type TRoute = {
  path: string;
  name: string;
  component: ComponentType;
  layout: string;
  showInSidebar?: boolean;
  isPrivate?: boolean;
  icon: IconType;
}

const routes: TRoute[] = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    layout: "/auth",
    icon: FaKey,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    layout: "/auth",
    icon: FaHtml5,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    layout: "/admin",
    // isPrivate: true,
    icon: FaKey,
  },
  {
    path: "/productos",
    name: "Productos",
    component: Productos,
    layout: "/admin",
    isPrivate: false,
    icon: FaList,
  },
  {
    path: "/productos/crear",
    name: "Productos",
    showInSidebar: false,
    component: ProductosCreate,
    layout: "/admin",
    isPrivate: true,
    icon: FaList,
  },
  {
    path: "/categoria/:categoriaId",
    name: "Categoria",
    component: Categoria,
    layout: "/admin",
    isPrivate: false,
    icon: FaGlobe,
  },
  {
    path: "/productos/:productoId",
    name: "Producto",
    component: Producto,
    layout: "/admin",
    isPrivate: false,
    icon: FaEdit,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    layout: "/admin",
    isPrivate: true,
    icon: FaUser,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    layout: "/admin",
    isPrivate: true,
    icon: FaUserCircle,
  },
  {
    path: "/proveedores",
    name: "Proveedores",
    component: ProveedoresIndex,
    layout: "/admin",
    isPrivate: false,
    icon: FaUserCircle,
  }
];

export default routes;