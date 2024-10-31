import { Container } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { fetchProductById } from "../../store/services/productService";
import { ProductoForm } from "./ProductoForm";

export function ProductoUpdate() {
  const { productoId } = useParams<{ productoId: string }>();

  if (!productoId) {
    return <Navigate to={"/productos"} />;
  }

  return (
    <Container>
      <h1>Editar un producto</h1>
      <ProductoForm
        getValues={() => fetchProductById(productoId)}
        productId={productoId}
      />
      ;
    </Container>
  );
}
