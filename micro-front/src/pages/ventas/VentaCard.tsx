import { Card, CardBody, CardHeader, CardTitle, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ISale } from "../../store/slices/saleSlice";

export function VentaCard({ sale }: { sale: ISale }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {new Date(sale.dateSale).toLocaleDateString("es")}
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Table className="fs-4">
          <tr>
            <td className="fw-medium">Producto</td>
            <td className="fw-medium">Cantidad</td>
            <td className="fw-medium">Precio unitario</td>
            <td className="fw-medium">Total</td>
          </tr>
          <tbody>
            {sale.details.map((d) => {
              return (
                <tr>
                  <td className="fw-medium">
                    <Link to={`/admin/productos/${d.product?._id}`}>
                      {d.product?.name}
                    </Link>
                  </td>
                  <td className="fw-medium">{d.quantity}</td>
                  <td className="fw-medium">${d.sellPrice}</td>
                  <td className="fw-medium">
                    ${(d.sellPrice ?? 0) * d.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
