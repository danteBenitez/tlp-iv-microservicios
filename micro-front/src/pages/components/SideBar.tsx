import { useLocation, NavLink } from "react-router-dom";
import { Nav, Navbar, Offcanvas, Image } from "react-bootstrap";
import logo from "../../assets/vite.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface SidebarProps {
  color: string;
  image: string;
  routes: Array<{
    path: string;
    icon: React.ComponentType;
    name: string;
    layout: string;
    redirect?: boolean;
    upgrade?: boolean;
  }>;
  show: boolean;
  handleClose: () => void;
}

function Sidebar({ color, image, routes, show, handleClose }: SidebarProps) {
  const location = useLocation();
  const activeRoute = (routeName: string) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const filteredRoutes = routes.filter(route => {
    if (route.name === "Edit Incident") return false;
    if (route.path === '/register') return false;
    if (route.path === '/login' && isAuthenticated) return false;
    return true;
  })

  return (
    <Offcanvas backdropClassName="w-100 h-100" show={show} placement="start" onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <Navbar.Brand href="/admin" className="d-flex align-items-center">
            <Image src={logo} roundedCircle className="me-2" style={{ width: 'auto', height: '40px' }} />
            <span>Tus Productos a la venta</span>
          </Navbar.Brand>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body
        style={{
          position: 'relative',
          overflow: 'auto',
          padding: '0',
        }}
      >
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1
          }}
        >
          <div
            style={{
              backgroundColor: color,
              opacity: 0.5,
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              zIndex: 2
            }}
          ></div>
          <Nav className="flex-column" style={{ position: 'relative', zIndex: 3 }}>
            {filteredRoutes.map((prop, key) => {
              if (!prop.redirect)
                return (
                  <li
                    className={`px-3 m-2 ${prop.upgrade
                      ? "active active-pro"
                      : activeRoute(prop.layout + prop.path)}
                    `
                    }
                    key={key}
                  >
                    <Nav.Item key={key} className={location.pathname.indexOf(prop.layout + prop.path) !== -1 ? 'active' : ''}>
                      <NavLink to={prop.layout + prop.path} className="nav-link">
                        <div className="nav-item-content">
                          {prop.icon && <prop.icon />}
                          {prop.name && <span className="nav-item-name ms-2">{prop.name}</span>}
                        </div>
                      </NavLink>
                    </Nav.Item>
                  </li>
                );
              return null;
            })}
          </Nav>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Sidebar;