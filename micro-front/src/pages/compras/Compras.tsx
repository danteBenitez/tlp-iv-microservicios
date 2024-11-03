import { Container } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CompraCard from "./CompraCard";
import { fetchPurchases } from "../../store/slices/purchaseSlice";

export default function ComprasIndex() {
  const token = useSelector((state: RootState) => state.auth.token);
  const purchases = useSelector(
    (state: RootState) => state.purchases.purchases
  );
  const{ loading:isLoading, error }= useSelector((state: RootState) => state.purchases);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch, token]);

  if (isLoading) {
    return <p>Cargando compras...</p>;
  }
  return (
    <Container>
      <h1 className="mb-3">Mis compras</h1>
      {
        error && <p className="text-danger">Error en el servidor de compras, intente nuevamente más tarde.</p>
      }
      <div className="d-flex flex-column gap-2">
        {purchases.map((p) => (
          <CompraCard key={p.purchaseId} purchase={p} />
        ))}
      </div>
    </Container>
  );
}
