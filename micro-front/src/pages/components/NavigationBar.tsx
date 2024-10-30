import React from 'react';
import { Navbar, Container, Button, Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import routes from './routes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { IUser } from '../../store/slices/userSlice';
import { showNotification } from '../../store/slices/notificationSlice';
import { FaBars, FaBell, FaSearch, FaSignOutAlt, FaTachometerAlt, FaUser } from 'react-icons/fa';

interface NavigationBarProps {
    mobileSidebarToggle: () => void;
}

const Header: React.FC<NavigationBarProps> = ({ mobileSidebarToggle }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const user: IUser = useSelector((state: RootState) => state.auth.user) as IUser;

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
        dispatch(showNotification({ message: 'Logout successful', type: 'success' }));
    }

    return (
        <Navbar bg="light" expand="md" data-bs-theme="light">
            <Container fluid>
                <Navbar.Brand
                    className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
                    <Button
                        variant="dark"
                        className="me-2 opacity-50"
                        onClick={mobileSidebarToggle}
                    >
                        <FaBars />
                    </Button>
                    <Navbar.Brand href="#" onClick={(e) => e.preventDefault()} className="me-5">
                        {getBrandText()}
                    </Navbar.Brand>
                </Navbar.Brand>
                <Navbar.Toggle className="me-2">
                    <FaBars />
                </Navbar.Toggle>
                <Navbar.Collapse>
                    <Nav className="bg-body-tertiary nav justify-content-center" navbar>
                        <Nav.Item
                            className="align-items-center"
                        >
                            <Nav.Link
                                data-toggle="dropdown"
                                as={Link}
                                to="home"
                                className="m-0 d-flex align-items-center"
                            >
                                <FaTachometerAlt />
                                <span className="d-lg-block ms-1">Dashboard</span>
                            </Nav.Link>
                        </Nav.Item>
                            <Dropdown as={Nav.Item}>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    data-toggle="dropdown"
                                    id="dropdown-67443507"
                                    variant="default"
                                    className="m-0 d-flex align-items-center"
                                >
                                    <FaBell />
                                    {/* <span className="notification">5</span> */}
                                    <span className="d-lg-block ms-1">Notification</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        href="/"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Notification 1
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="/"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Notification 2
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="/"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Notification 3
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="/"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Notification 4
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        href="/"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        Another notification
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        <Nav.Item>
                            <Nav.Link
                                href="/"
                                onClick={(e) => e.preventDefault()}
                                className="m-0 d-flex align-items-center"
                            >
                                <FaSearch />
                                <span className="d-lg-block ms-1">Search</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link
                                as={Link}
                                className="m-0 d-flex align-items-center"
                                to="profile"
                            >
                                <FaUser />
                                <span className="ms-1">Account</span>
                            </Nav.Link>
                        </Nav.Item>
                        <Dropdown as={Nav.Item}>
                            <Dropdown.Toggle
                                aria-expanded={false}
                                aria-haspopup={true}
                                as={Nav.Link}
                                data-toggle="dropdown"
                                id="navbarDropdownMenuLink"
                                variant="default"
                                className="m-0"
                            >
                                <span>Dropdown</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                                <Dropdown.Item
                                    href="/"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Action
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Another action
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Something
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href="/"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Something else here
                                </Dropdown.Item>
                                <div className="divider"></div>
                                <Dropdown.Item
                                    href="/"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    Separated link
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                    <Navbar.Collapse>
                        {user &&
                            <>
                                <Nav className="ms-auto text-center">
                                    <Nav.Item
                                        className="align-items-center"
                                    >
                                        <span>Bienvenido {user.username}</span>
                                    </Nav.Item>
                                </Nav>
                                <Nav className='ms-auto'>
                                    <Nav.Item>
                                        <Nav.Link
                                            as={Link}
                                            className="m-0 d-flex align-items-center"
                                            to="/"
                                            onClick={handleLogout}
                                        >
                                            <FaSignOutAlt className='me-2' />
                                            Logout
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </>
                        }
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;