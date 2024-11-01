import { Card, Col } from "react-bootstrap";
import { ISupplier } from "../../store/slices/supplierSlice";

type TProveedoresCard = {
  supplier: ISupplier;
  onEdit?: (supplierId: string) => void;
  onDelete?: (supplierId: string) => void;
};

export default function ProveedoresCard({
  onDelete,
  onEdit,
  supplier,
}: TProveedoresCard) {
  void onDelete;
  void onEdit;
  return (
    <Col md={4} key={supplier.supplierId}>
      <Card className="mb-4">
        <Card.Body className="fs-5">
          <div className="d-flex align-items-center gap-2">
            <Card.Title className="fw-bold fs-1">
              {supplier.companyName}
            </Card.Title>
            {/* <Card.Text className="fs-3">
              <Badge className="bg-success">${producto.price}</Badge>
            </Card.Text> */}
          </div>

          <Card.Text>
            <span>Dirección:</span> {supplier.address}
          </Card.Text>
          <Card.Text>
            <span>Cuit:</span> {supplier.cuit}
          </Card.Text>
          <Card.Text>
            <span>Correo electrónico: </span>
            <a target="_blank" href={`mailto:${supplier.email}`}>
              {supplier.email}
            </a>
          </Card.Text>
          <Card.Text>
            <span>Teléfono:</span>
            <a
              target="_blank"
              href={`https://api.whatsapp.com/send?phone=${supplier.phoneNumber}`}
            >
              {supplier.phoneNumber}
            </a>
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
}
