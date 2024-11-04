import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesForUser } from "../../store/slices/saleSlice";
import { AppDispatch, RootState } from "../../store/store";
import { VentaCard } from "./VentaCard";

export function MisVentas() {
  const token = useSelector((state: RootState) => state.auth.token);
  const sales = useSelector((state: RootState) => state.sales.sales);
  const isLoading = useSelector((state: RootState) => state.sales.loading);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSalesForUser());
  }, [dispatch, token]);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <Container>
      <h1 className="mb-3">Mis compras</h1>
      <div className="d-flex flex-column gap-2">
        {sales.map((s) => (
          <VentaCard sale={s} />
        ))}
      </div>
    </Container>
  );
}
