import { Container } from "react-bootstrap";
import { ProductoForm } from "./ProductoForm";
import "./ReactInputTags.css";

export function ProductosCreate() {
  return (
    <Container>
      <h1 className="py-2">Crear un producto</h1>
      <ProductoForm />
    </Container>
  );
}
