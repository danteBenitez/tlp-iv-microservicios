import React, { useEffect } from "react";
import { Button, Card, Col, Container, NavLink, Row } from "react-bootstrap";
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../store/slices/productSlice";
import { AppDispatch, RootState } from "../store/store";
import "./home.css";
import { ProductoCard } from "./productos/ProductoCard";

const Home: React.FC = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const filtered = products.slice(0, 3);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Algo salió mal: {error}</p>;
  }

  return (
    <Container>
      <Row className="justify-content-center text-center my-5">
        <Col md={8}>
          <h1 className="display-4">
            Bienvenido a Nuestra Tienda{" "}
            <span className="text-success">TeLoCompro</span>
          </h1>
          <p className="lead">
            Encuentra los mejores productos al mejor precio.
          </p>
        </Col>
      </Row>
      <Row className="">
        {filtered.map((producto) => (
          <ProductoCard producto={producto} />
        ))}
      </Row>
      <Row className="text-center justify-content-center my-5">
        <Col md={12}>
          <h2>Categorías Populares</h2>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Electrónica</Card.Title>
              <NavLink as={Link} to="/admin/categoria/electronica">
                <Button variant="success">Ver Categoría</Button>
              </NavLink>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Ropa</Card.Title>
              <NavLink as={Link} to="/admin/categoria/ropa">
                <Button variant="success">Ver Categoría</Button>
              </NavLink>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Hogar</Card.Title>
              <NavLink as={Link} to="/admin/categoria/hogar">
                <Button variant="success">Ver Categoría</Button>
              </NavLink>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Deportes</Card.Title>
              <NavLink as={Link} to="/admin/categoria/deportes">
                <Button variant="success">Ver Categoría</Button>
              </NavLink>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="text-center justify-content-center my-5">
        <Col md={12}>
          <NavLink as={Link} to="/admin/productos">
            <Button variant="outline-primary" size="lg">
              Ver Todos los Productos
            </Button>
          </NavLink>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
