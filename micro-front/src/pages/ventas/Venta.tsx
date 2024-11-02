import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { getSaleById } from "../../store/services/saleService";
import { showNotification } from "../../store/slices/notificationSlice";
import { ISale } from "../../store/slices/saleSlice";
import { AppDispatch } from "../../store/store";
import { VentaCard } from "./VentaCard";

export function Venta() {
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
    return <Navigate to="/admin/sales/" />;
  }

  return (
    <Container>
      <h1 className="mb-3">Detalle de compra</h1>
      <div className="d-flex flex-column gap-2">
        <VentaCard sale={sale} />
      </div>
    </Container>
  );
}
