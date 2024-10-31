import { useState } from "react";
import { addSupplier, ISupplier } from "../../store/slices/supplierSlice";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

type SupplierErrorMessages = {
  [k in keyof Omit<ISupplier, "supplierId">]?: string[] | undefined;
};

const supplierSchema = z.object({
  companyName: z
    .string({
      message: "Un proveedor debe tener un nombre",
    })
    .min(1, {
      message: "Un proveedor debe tener un nombre",
    }),
  cuit: z.string({
    message: "Un proveedor debe tener un CUIT",
  }),
  address: z
    .string({
      message: "Un proveedor debe tener una dirección",
    })
    .min(1, {
      message: "Un proveedor debe  tener al menos un valor",
    }),
  email: z
    .string({
      message: "Un proveedor debe tener un email",
    })
    .email({
      message: "El email ingresado no es válido",
    }),
  phoneNumber: z.string({
    message: "Un proveedor debe tener un número de teléfono",
  }),
});

export default function ProveedoresCreate() {
  const navigation = useNavigate();

  const [form, setForm] = useState<Omit<ISupplier, "supplierId">>({
    supplierId: "",
    companyName: "",
    cuit: "",
    phoneNumber: "",
    address: "",
    email: "",
  } as Omit<ISupplier, "supplierId">);

  const [formErrors, setFormErrors] = useState<SupplierErrorMessages>();
  const dispatch: AppDispatch = useDispatch();

  const handleChange = async (name: string, value: string | string[]) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { success, error, data } = await supplierSchema.safeParseAsync(
        form
      );
      if (data) {
        if (
          await dispatch(
            addSupplier({
              ...data,
              cuit: data.cuit.toString(),
            })
          )
        ) {
          navigation("/admin/proveedores");
        }
      }
      if (!success && error?.formErrors) {
        if (error.formErrors) setFormErrors(error.formErrors.fieldErrors);
      }
      navigation("/admin/proveedores");
    } catch (err) {
      console.log("Error al crear proveedor", err);
    }
  };

  return (
    <Container>
      <h1 className="py-2">Registrar un nuevo proveedor</h1>
      <Form className="fs-3" onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del proveedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del proveedor"
                className="fs-4"
                defaultValue={form.companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("companyName", e.target.value)
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.companyName?.[0] ?? null}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>CUIT del proveedor</Form.Label>
              <Form.Control
                type="number"
                placeholder="Teléfono el proveedor"
                className="fs-4"
                defaultValue={form.cuit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("cuit", e.target.value)
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.cuit?.[0] ?? null}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Dirección del proveedor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Dirección el proveedor"
            className="fs-4"
            defaultValue={form.address}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("address", e.target.value)
            }
          />
          <Form.Text className="text-danger">
            {formErrors?.address?.[0] ?? null}
          </Form.Text>
        </Form.Group>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Email del proveedor</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email el proveedor"
                className="fs-4"
                defaultValue={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("email", e.target.value)
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.email?.[0] ?? null}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono del proveedor</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Teléfono el proveedor"
                className="fs-4"
                defaultValue={form.phoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("phoneNumber", e.target.value)
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.phoneNumber?.[0] ?? null}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="success" type="submit" className="fs-5 px-3 py-2 mt-3">
          Guardar
        </Button>
      </Form>
    </Container>
  );
}
