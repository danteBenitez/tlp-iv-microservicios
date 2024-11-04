import { ComponentType } from 'react';
import { FaEdit, FaGlobe, FaHtml5, FaKey, FaList, FaShoppingBag, FaShoppingCart, FaUser, FaUserCircle } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
import ComprasCreate from '../compras/CompraCreate';
import ComprasIndex from '../compras/Compras';
import { Envios } from '../envios/Envios';
import Login from '../Login';
import { CarritoCompraRealizada } from '../productos/carrito/CarritoCompra';
import { CarritoCompras } from '../productos/carrito/CarritoCompras';
import Producto from '../productos/Producto';
import Productos from '../productos/Productos';
import { ProductosCreate } from '../productos/ProductosCreate';
import { ProductoUpdate } from '../productos/ProductoUpdate';
import ProveedoresIndex from '../proveedores/Proveedores';
import ProveedoresCreate from '../proveedores/ProveedoresCreate';
import ProveedoresUpdate from '../proveedores/ProveedoresUpdate';
import Register from '../Register';
import Profile from '../users/profile';
import Users from '../users/user';
import { Venta } from '../ventas/Venta';
import { Ventas } from '../ventas/Ventas';

export type TRoute = {
  path: string;
  name: string;
  component: ComponentType;
  layout: string;
  isAdminRoute?: boolean;
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
    isAdminRoute: true,
    isPrivate: true,
    icon: FaList,
  },
  {
    path: "/productos/:productoId/editar",
    name: "Productos",
    showInSidebar: false,
    isAdminRoute: true,
    component: ProductoUpdate,
    layout: "/admin",
    isPrivate: true,
    icon: FaList,
  },
  {
    path: "/sales/",
    name: "Ventas",
    component: Ventas,
    isAdminRoute: true,
    layout: "/admin",
    isPrivate: true,
    showInSidebar: true,
    icon: FaGlobe,
  },
  {
    path: "/sales/:saleId",
    name: "Compra",
    component: Venta,
    layout: "/admin",
    isPrivate: true,
    showInSidebar: false,
    icon: FaGlobe,
  },
  {
    path: "/envios/",
    name: "Mis envíos",
    component: Envios,
    layout: "/admin",
    isPrivate: true,
    showInSidebar: true,
    icon: FaGlobe,
  },
  {
    path: "/carrito/",
    name: "Mi carrito de compras",
    component: CarritoCompras,
    layout: "/admin",
    isPrivate: true,
    icon: FaShoppingCart,
  },
  {
    path: "/carrito/compra",
    name: "Compra",
    component: CarritoCompraRealizada,
    layout: "/admin",
    showInSidebar: false,
    isPrivate: true,
    icon: FaShoppingCart,
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
    isAdminRoute: true,
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
    isAdminRoute: true,
    layout: "/admin",
    isPrivate: true,
    icon: FaUserCircle,
  },
  {
    path: "/proveedores/crear",
    name: "Proveedor",
    showInSidebar: false,
    isAdminRoute: true,
    component: ProveedoresCreate,
    layout: "/admin",
    isPrivate: true,
    icon: FaList,
  },
  {
    path: "/proveedores/:supplierId/editar",
    name: "Proveedor",
    showInSidebar: false,
    isAdminRoute: true,
    component: ProveedoresUpdate,
    layout: "/admin",
    isPrivate: true,
    icon: FaList,
  },
  {
    path: "/compras",
    name: "Compras",
    component: ComprasIndex,
    layout: "/admin",
    isAdminRoute: true,
    isPrivate: true,
    icon: FaShoppingBag,
  },
  {
    path: "/compras/crear",
    name: "Compras",
    showInSidebar: false,
    component: ComprasCreate,
    layout: "/admin",
    isAdminRoute: true,
    isPrivate: true,
    icon: FaList,
  },
];

export default routes;