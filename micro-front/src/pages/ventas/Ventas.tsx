import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales } from "../../store/slices/saleSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Mantenimiento } from "../components/Mantenimiento";
import { VentaCard } from "./VentaCard";

export function Ventas() {
  const token = useSelector((state: RootState) => state.auth.token);
  const sales = useSelector((state: RootState) => state.sales.sales);
  const isLoading = useSelector((state: RootState) => state.sales.loading);
  const error = useSelector((state: RootState) => state.sales.loading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSales());
  }, [dispatch, token]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <Mantenimiento />;
  }

  return (
    <Container>
      <h1 className="mb-3">Ventas</h1>
      <div className="d-flex flex-column gap-2">
        {sales.map((s) => (
          <VentaCard sale={s} />
        ))}
      </div>
    </Container>
  );
}
