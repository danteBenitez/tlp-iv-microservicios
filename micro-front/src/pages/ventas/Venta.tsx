import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Table,
} from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, Navigate, useParams } from "react-router-dom";
import { getSaleById } from "../../store/services/saleService";
import { showNotification } from "../../store/slices/notificationSlice";
import { ISale } from "../../store/slices/saleSlice";
import { AppDispatch } from "../../store/store";

export function Ventas() {
  const { saleId } = useParams<{ saleId: string }>();
  const [sale, setSale] = useState<ISale | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const getSale = async () => {
      try {
        if (!saleId) return;
        const sale = await getSaleById(saleId);
        setSale(sale);
        setLoading(false);
      } catch (err) {
        if (err instanceof AxiosError) {
          dispatch(
            showNotification({
              message: "Algo salió mal " + err.response?.data.message,
              type: "error",
            })
          );
        }
      }
    };
    getSale();
  }, [dispatch, saleId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!sale) {
    return <Navigate to="/admin/ventas" />;
  }

  return (
    <Container>
      <h1 className="mb-3">Detalle de compra</h1>
      <div className="d-flex flex-column gap-2">
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
                <td className="fw-medium">Precio</td>
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
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
