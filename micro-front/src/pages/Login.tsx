import { FormEvent, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  NavLink,
  Row,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import loginBackground from "../assets/img/login-bg.jpg";
import axiosInstance from "../store/actionAxios";
import { login } from "../store/slices/authSlice";
import { showNotification } from "../store/slices/notificationSlice";
import LoadingOverlay from "./components/LoadingOverlay";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      dispatch(login({ user: response.data.user, token: response.data.token }));
      dispatch(
        showNotification({ message: "Login successful", type: "success" })
      );
      navigate("/admin/home");
    } catch (error: any) {
      dispatch(
        showNotification({
          message: error.response.data.message,
          type: "error",
        })
      );
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <Container
      fluid
      className="d-flex align-items-center"
      style={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        height: "125vh",
      }}
    >
      <Row className="w-100">
        <Col
          lg={6}
          className="d-flex align-items-center justify-content-center py-5"
        >
          <div
            className="w-100 border rounded bg-white p-4 rounded-2 fs-4"
            style={{ maxWidth: "500px", color: "black" }}
          >
            <div className="text-center mb-4">
              <h1 className="text-center mb-4 fw-bold fs-1">Iniciar Sesión</h1>
              <p className="text-muted">
                Bienvenido de nuevo, por favor ingrese sus credenciales
              </p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>
              <InputPassword
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" className="w-100 mb-2">
                Login
              </Button>
            </Form>
            <div className="text-center mt-4 flex fs-5">
              <span>No tienes una cuenta?</span>
              <NavLink
                as={Link}
                to="/auth/register"
                className="text-decoration-underline text-primary"
              >
                Regístrate aquí
              </NavLink>
            </div>
          </div>
        </Col>
        <Col lg={6} className="d-none d-lg-block position-relative z-index">
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to expand, rgba(106, 17, 203, 0.2), rgba(37, 117, 252, 0.5))",
            }}
          ></div>
          <img
            src={loginBackground}
            alt="mi app de compras"
            className="img-fluid h-100 w-100 object-fit-cover rounded"
            style={{ boxShadow: "0 0 35px rgba(0, 0, 0, 0.8)" }} // Agregar borde difuminado
          />
        </Col>
      </Row>
    </Container>
  );
}

function InputPassword({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form.Group controlId="password" className="mb-3">
      <Form.Label>Contraseña</Form.Label>
      <InputGroup>
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          required
          value={value}
          onChange={onChange}
        />
        <Button onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </Button>
      </InputGroup>
    </Form.Group>
  );
}
