import { Card, CardBody, CardHeader, CardTitle, Table } from "react-bootstrap";
import { IPurchase } from "../../store/slices/purchaseSlice";
import { Link } from "react-router-dom";

export default function CompraCard({ purchase }: { purchase: IPurchase }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Compra realizada el{" "}
          {new Date(purchase.datePurchase).toLocaleDateString("es", {
            year: "numeric",
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
          , al proveedor {purchase.supplier?.companyName}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Table className="fs-4">
          <thead>
            <tr>
              <td className="fw-medium">Producto</td>
              <td className="fw-medium">Cantidad</td>
              <td className="fw-medium">Precio de costo</td>
              <td className="fw-medium">Total</td>
            </tr>
          </thead>
          <tbody>
            {purchase.details.map((d) => (
              <tr key={d.purchaseId}>
                <td className="fw-medium">
                  <Link to={`/admin/productos/${d.product?._id}`}>
                    {d.product?.name}
                  </Link>
                </td>
                <td className="fw-medium">{d.quantity}</td>
                <td className="fw-medium">${d.costPrice}</td>
                <td className="fw-medium">
                  ${(d.costPrice ?? 0) * d.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
