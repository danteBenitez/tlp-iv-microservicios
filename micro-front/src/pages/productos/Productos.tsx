import React, { useEffect } from "react";
import {
  Col,
  Container,
  Row
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../../store/slices/productSlice";
import { AppDispatch, RootState } from "../../store/store";
import { ProductoCard } from "./ProductoCard";

const Productos: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
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
      <Row>
        <Col>
          <h1>Todos los Productos</h1>
        </Col>
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
