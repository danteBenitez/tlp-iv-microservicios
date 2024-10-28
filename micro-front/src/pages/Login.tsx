import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Container, Row, Col, NavLink } from 'react-bootstrap';
import axiosInstance from "../store/actionAxios";
import { showNotification } from "../store/slices/notificationSlice";
import LoadingOverlay from "./components/LoadingOverlay";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            console.log(response)
            dispatch(login({ user: response.data.user, token: response.data.access_token }));
            dispatch(showNotification({ message: 'Login successful', type: 'success' }));
            navigate('/admin/home');
        } catch (error: any) {
            dispatch(showNotification({ message: error.response.data.message, type: 'error' }));
            setIsSubmitting(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    if (isSubmitting) {
        return <LoadingOverlay />
    }

    return (
        <Container fluid className="d-flex align-items-center" style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)', height: '125vh' }}>
            <Row className="w-100">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <p className="text-center mb-4">Bienvenido de nuevo, por favor ingrese sus credenciales</p>
            
                <Col lg={6} className="d-flex align-items-center justify-content-center py-5">
                    <div className="w-100 border rounded p-2" style={{ maxWidth: '400px', color: 'black' }}>
                        <div className="text-center mb-4">
                            <h1 className="h3 mb-3 font-weight-normal">Login</h1>
                            <p className="text-muted">
                                Enter your username below to login to your account
                            </p>
                        </div>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="username" className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="password" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <NavLink
                                    href="/auth/register"
                                    className="text-decoration-underline text-primary float-end m-2"
                                >
                                    Forgot your password?
                                </NavLink>
                            </Form.Group>
                            <Button type="submit" className="w-100 mb-2">
                                Login
                            </Button>
                            <Button variant="outline-primary" className="w-100">
                                Login with Google
                            </Button>
                        </Form>
                        <div className="text-center mt-4">
                            Don't have an account?{" "}
                            <NavLink
                                as={Link}
                                to="/auth/register"
                                className="text-decoration-underline text-primary"
                            >
                                Sign up
                            </NavLink>
                        </div>
                    </div>
                </Col>
                <Col lg={6} className="d-none d-lg-block position-relative z-index">
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to expand, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.5))' }}></div>
                    <img
                        src='https://images.unsplash.com/photo-1612838320302-4b3b3b3b3b3b'
                        alt="mi app de compras"
                        className="img-fluid h-100 w-100 object-fit-cover rounded"
                        style={{ boxShadow: '0 0 35px rgba(0, 0, 0, 0.8)' }} // Agregar borde difuminado
                    />
                </Col>
            </Row>
        </Container>
    );
}