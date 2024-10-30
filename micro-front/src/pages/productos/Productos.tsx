import React, { useEffect } from "react";
import { Button, Card, Col, Container, NavLink, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../../store/slices/productSlice";
import { AppDispatch, RootState } from "../../store/store";
import { resolveImageUrl } from "../../utils/resolve-image-url";

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
          <Col md={4} key={producto._id}>
            <Card className="mb-4">
              {producto.images.length > 0 ? (
                <Card.Img
                  src={resolveImageUrl(producto.images[0]._id)}
                ></Card.Img>
              ) : null}
              <Card.Body>
                <Card.Title>{producto.name}</Card.Title>
                <Card.Text>{producto.description}</Card.Text>
                <Card.Text>${producto.price}</Card.Text>
                <Card.Text>{producto.brand}</Card.Text>
                <Card.Text>Tags: {producto.tags.join(", ")}</Card.Text>
                <Card.Text>Imagenes: {producto.images.length}</Card.Text>
                <Card.Text>Stock: {producto.stock}</Card.Text>
                <Card.Text>Id: {producto._id}</Card.Text>
                <NavLink as={Link} to={`${producto._id}`}>
                  <Button variant="primary">Ver Producto</Button>
                </NavLink>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Productos;
