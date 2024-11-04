import { Container } from "react-bootstrap";
import ProveedoresForm from "./ProveedoresForm";

export default function ProveedoresCreate() {
  return (
    <Container>
      <h1 className="py-2">Registrar un nuevo proveedor</h1>
      <ProveedoresForm />
    </Container>
  );
}
