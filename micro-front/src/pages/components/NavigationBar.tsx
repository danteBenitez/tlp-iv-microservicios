import React from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import routes from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { IUser } from "../../store/slices/userSlice";
import { showNotification } from "../../store/slices/notificationSlice";
import { FaBars, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

interface NavigationBarProps {
  mobileSidebarToggle: () => void;
}

const Header: React.FC<NavigationBarProps> = ({ mobileSidebarToggle }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const user: IUser = useSelector(
    (state: RootState) => state.auth.user
  ) as IUser;

  const getBrandText = () => {
    for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(
      showNotification({ message: "Logout successful", type: "success" })
    );
  };

  return (
    <Navbar bg="light" expand="md" data-bs-theme="light">
      <Container fluid>
        <Navbar.Brand className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="me-2 opacity-50"
            onClick={mobileSidebarToggle}
          >
            <FaBars />
          </Button>
          <Navbar.Brand
            href="#"
            onClick={(e) => e.preventDefault()}
            className="me-5"
          >
            {getBrandText()}
          </Navbar.Brand>
        </Navbar.Brand>
        <Navbar.Toggle className="me-2">
          <FaBars />
        </Navbar.Toggle>
        <Navbar.Collapse>
          <Navbar.Collapse>
            {user && (
              <>
                <Nav className="ms-auto text-center">
                  <Nav.Item className="align-items-center">
                    <span>Bienvenido {user.username}</span>
                  </Nav.Item>
                </Nav>
                <Nav className="ms-auto">
                  <Nav.Item>
                    <Nav.Link
                      as={Link}
                      className="m-0 d-flex align-items-center"
                      to="/"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" />
                      Logout
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </>
            )}
            {!user && (
              <Nav className="ms-auto">
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    className="m-0 d-flex align-items-center"
                    to="/auth/login"
                  >
                    <FaSignInAlt className="me-2" />
                    Iniciar Sesión
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            )}
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
