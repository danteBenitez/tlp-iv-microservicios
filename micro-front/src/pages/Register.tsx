import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { register } from "../store/slices/authSlice";
import { Button, Col, Container, Form, NavLink, Row } from "react-bootstrap";
import { showNotification } from "../store/slices/notificationSlice";

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        email: '',
        dni: '',
        phone: '',
        address: '',
        city: ''
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
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <h1 className="mb-4">Register</h1>
                    <Form onSubmit={handleRegister} className="border border-success rounded p-5 bg-white opacity-75">
                        <Row>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicName"
                                >
                                    <Form.Label>Name and Lastname</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicDni"
                                >
                                    <Form.Label>DNI</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter DNI"
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicUsername"
                                >
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formBasicPassword"
                                >
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicEmail"
                        >
                            <Form.Label>Email address</Form.Label>
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
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Row>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6} lg={6}>
                                <Form.Group>
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
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