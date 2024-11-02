import { Card, CardBody, CardHeader, CardTitle, Table } from "react-bootstrap";
import { IPurchase } from "../../store/slices/purchaseSlice";

export default function CompraCard({ purchase }: { purchase: IPurchase }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {new Date(purchase.datePurchase).toLocaleDateString("es")}
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
                  {d.product?.name}
                  {/* <Link to={`/admin/productos/${d.product?._id}`}>
                        </Link> */}
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
