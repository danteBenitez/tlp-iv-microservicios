import { Button, Col, Container, Row } from "react-bootstrap";
import { AppDispatch, RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import CompraCard from "./CompraCard";
import { fetchPurchases } from "../../store/slices/purchaseSlice";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { Mantenimiento } from "../components/Mantenimiento";

export default function ComprasIndex() {
  const token = useSelector((state: RootState) => state.auth.token);
  const purchases = useSelector(
    (state: RootState) => state.purchases.purchases
  );
  const { loading: isLoading, error } = useSelector(
    (state: RootState) => state.purchases
  );
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch, token]);

  if (isLoading) {
    return <p>Cargando compras...</p>;
  }

  if (error) {
    return <Mantenimiento />
  }

  return (
    <Container>
      <Row className="p-4 justify-content-between">
        <Col md={4}>
          <h1>Compras</h1>
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Link to="/admin/compras/crear">
            <Button
              variant="primary"
              className="d-flex align-items-center justify-content-center gap-2 p-2 fs-5"
            >
              <FaPlus />
              Ingresar nueva compra
            </Button>
          </Link>
        </Col>
      </Row>
      <div className="d-flex flex-column gap-2">
        {purchases.map((p, i) => (
          <CompraCard key={p.purchaseId ?? '' + i} purchase={p} />
        ))}
      </div>
    </Container>
  );
}
