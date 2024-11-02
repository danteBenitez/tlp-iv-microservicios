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
  const isLoading = useSelector((state: RootState) => state.sales.loading);
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
      <div className="d-flex flex-column gap-2">
        {purchases.map((p) => (
          <CompraCard key={p.purchaseId} purchase={p} />
        ))}
      </div>
    </Container>
  );
}
