import React, { useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../../store/slices/productSlice";
import { AppDispatch, RootState } from "../../store/store";
import { ProductoCard } from "./ProductoCard";

const Productos: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const isAdmin = useSelector((state: RootState) =>
    state.auth?.user?.roles?.find((r) => r.name == "admin")
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Hubo un error al cargar los productos</p>;
  }

  return (
    <Container className="my-5">
      <Row className="p-4 justify-content-between">
        <Col md={9}>
          <h1>Todos los Productos</h1>
        </Col>
        {isAdmin ? (
          <Col md={3} className="d-flex justify-content-end">
            <Link to="/admin/productos/crear">
              <Button
                variant="primary"
                className="d-flex align-items-center justify-content-center gap-2 p-2 fs-5"
              >
                <FaPlus></FaPlus>
                Agregar producto
              </Button>
            </Link>
          </Col>
        ) : null}
      </Row>
      {products.length == 0 ? <p>No hay productos registrados</p> : null}
      <Row>
        {products.map((producto) => (
          <ProductoCard producto={producto} />
        ))}
      </Row>
    </Container>
  );
};

export default Productos;
