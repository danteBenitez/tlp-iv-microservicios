import Login from '../Login';
import Register from '../Register';
import Users from '../users/user';
import Home from '../Home';
import estadoEnvio from "../estadoEnvio"
import Profile from '../users/profile';
import { FaEdit, FaGlobe, FaHtml5, FaKey, FaList, FaUser, FaUserCircle } from 'react-icons/fa';

const routes = [
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
    path: "/user",
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
];

export default routes;