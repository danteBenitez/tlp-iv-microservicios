import { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Container,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSales } from "../../store/slices/saleSlice";
import { AppDispatch, RootState } from "../../store/store";

export function Ventas() {
  const token = useSelector((state: RootState) => state.auth.token);
  const sales = useSelector((state: RootState) => state.sales.sales);
  const isLoading = useSelector((state: RootState) => state.sales.loading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch, token]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <Container>
      <h1 className="mb-3">Mis compras</h1>
      <div className="d-flex flex-column gap-2">
        {sales.map((s) => (
          <Card>
            <CardHeader>
              <CardTitle>
                {new Date(s.dateSale).toLocaleDateString("es")}
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
                  {s.details.map((d) => {
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
        ))}
      </div>
    </Container>
  );
}
