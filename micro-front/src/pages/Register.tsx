import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { register } from "../store/slices/authSlice";
import {
  Button,
  Col,
  Container,
  Form,
  NavLink,
  Row,
} from "react-bootstrap";
import { showNotification } from "../store/slices/notificationSlice";
import { z } from "zod";
import { AxiosError } from "axios";

const createUserSchema = z
  .object({
    username: z
      .string()
      .min(1, {
        message: "El nombre de usuario es requerido",
      })
      .max(255, {
        message: "El nombre de usuario debe tener máximo 255 caracteres",
      }),
    email: z
      .string()
      .min(1, {
        message: "El correo electrónico es requerido",
      })
      .email({
        message: "Correo electrónico no es válido",
      }),
    password: z
      .string()
      .refine((password) => /[A-Z]/.test(password), {
        message: "La contraseña debe tener al menos una mayúscula",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "La contraseña debe tener al menos una minúscula",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "La contraseña debe tener al menos un número",
      })
      .refine((password) => /[!@#$%^&*]/.test(password), {
        message: "La contraseña debe tener al menos un caracter especial",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterErrorMessages = {
  [k in keyof z.infer<typeof createUserSchema>]: string[] | undefined;
};

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<RegisterErrorMessages>({
    username: [],
    email: [],
    password: [],
    confirmPassword: [],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const { data, success, error } = await createUserSchema.safeParseAsync(
      formData
    );

    if (!success) {
      setFormErrors(error.formErrors.fieldErrors as RegisterErrorMessages);
      return;
    }

    try {
      await dispatch(register(data));
      dispatch(
        showNotification({ message: "Usuario registrado", type: "success" })
      );
      navigate("/auth/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(
          showNotification({
            message: error?.response?.data.message || "Error desconocido",
            type: "error",
          })
        );
      }
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100"
    >
      <Row className="w-100 justify-content-center my-5">
        <h1 className="text-center mb-4">Registrarme</h1>
        <p className="text-center mb-4">
          Por favor completa el formulario para registrarte.
        </p>

        <Col xs={12} md={8} lg={6}>
          <Form
            onSubmit={handleRegister}
            className="border border-primary rounded p-5 bg-white"
          >
            <Form.Group className="mb-3" controlId="username-form">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa el nombre de usuario que usarás"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <Form.Text className="text-danger">
                {formErrors.username?.[0] ?? null}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email-form">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo electrónico"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Col>
                <Form.Text className="text-danger d-block">
                  {formErrors.email?.[0] ?? null}
                </Form.Text>
                <Form.Text className="text-muted">
                  Nunca compartiremos tu correo con nadie más.
                </Form.Text>
              </Col>
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="password-form">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-danger">
                    {formErrors.password?.[0] ?? null}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="password-confirm-form">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Ingresa nuevamente tu contraseña"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-danger">
                    {formErrors.confirmPassword?.[0] ?? null}
                  </Form.Text>
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
  );
}
