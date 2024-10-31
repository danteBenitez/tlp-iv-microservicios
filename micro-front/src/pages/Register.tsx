import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { register } from "../store/slices/authSlice";
import { Button, Col, Container, Form, NavLink, Row } from "react-bootstrap";
import { showNotification } from "../store/slices/notificationSlice";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value, });
    }

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(register(formData));
            dispatch(showNotification({ message: 'Usuario registrado', type: 'success' }));
            navigate('/auth/login');
        } catch (error: any) {
            console.log(error);
            dispatch(showNotification({ message: error.response.data.message, type: 'error' }));
        }
    }

    const [checked, setChecked] = useState(false);

    const handleCheckbox = () => {
        setChecked(!checked);
    }

    return (
        <Container fluid
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{ background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}
        >
            <Row className="w-100 justify-content-center my-5">
            <h1 className="text-center mb-4">Register New User</h1>
            <p className="text-center mb-4">Please fill out the form below to register a new user</p>
                <Col xs={12} md={8} lg={6}>
                    <Form onSubmit={handleRegister} className="border border-success rounded p-5 bg-white opacity-75">
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Row>
                            <Col className="col">
                                <Form.Group className="mt-3" controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Check me out"
                                        onChange={handleCheckbox}
                                        checked={checked}
                                        style={{ cursor: 'pointer', color: 'black', whiteSpace: 'nowrap' }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="border-top pt-4 border-black">
                            <Col className="d-flex justify-content-start">
                                <NavLink
                                    as={Link}
                                    to="/auth/login"
                                    vocab="true"
                                    type="button"
                                    className="btn btn-primary border border-outline-success text-decoration-underline"
                                >
                                    <Button variant="primary" size="sm">
                                        Back
                                    </Button>
                                </NavLink>
                            </Col>
                            <Col className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-75"
                                    size="sm"
                                >
                                    Register
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}