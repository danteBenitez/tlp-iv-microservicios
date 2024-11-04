import { Container } from "react-bootstrap";
import CompraForm from "./CompraForm";

export default function CompraCreate() {
  return (
    <Container>
      <h1 className="py-2">Ingresar una nueva compra</h1>
      <CompraForm />
    </Container>
  );
}
