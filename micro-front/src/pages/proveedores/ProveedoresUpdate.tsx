import { Container } from "react-bootstrap";
import ProveedoresForm from "./ProveedoresForm";
import { Navigate, useParams } from "react-router-dom";
import { getSupplierById } from "../../store/services/suppliersService";

export default function ProveedoresUpdate() {
  const { supplierId } = useParams<{ supplierId: string }>();

  if (!supplierId) {
    return <Navigate to={"/productos"} />;
  }
  return (
    <Container>
      <h1 className="py-2">Editar Proveedor</h1>
      <ProveedoresForm
        supplierId={supplierId}
        getValues={() => getSupplierById(supplierId)}
      />
    </Container>
  );
}
