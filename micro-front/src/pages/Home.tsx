import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import './home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log('user', user);
  
  return (
    <Container>
    <Row className="justify-content-center text-center my-5">
      <Col md={8}>
        <h1 className="display-4">Bienvenido a Nuestra Tienda</h1>
        <p className="lead">Encuentra los mejores productos al mejor precio.</p>
      </Col>
    </Row>
    <Row className="text-center justify-content-center">
      <Col md={4}>
        <Card className="mb-4">
          <Card.Img variant="top" src="ruta/a/imagen1.jpg" />
          <Card.Body>
            <Card.Title>Producto Destacado 1</Card.Title>
            <Card.Text>
              Descripción breve del producto destacado 1.
            </Card.Text>
            <Link to='/producto/1'>
              <Button variant="primary">Ver Producto</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Img variant="top" src="ruta/a/imagen2.jpg" />
          <Card.Body>
            <Card.Title>Producto Destacado 2</Card.Title>
            <Card.Text>
              Descripción breve del producto destacado 2.
            </Card.Text>
            <Link to='/producto/2'>
              <Button variant="primary">Ver Producto</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="mb-4">
          <Card.Img variant="top" src="ruta/a/imagen3.jpg" />
          <Card.Body>
            <Card.Title>Producto Destacado 3</Card.Title>
            <Card.Text>
              Descripción breve del producto destacado 3.
            </Card.Text>
            <Link to='/producto/3'>
              <Button variant="primary">Ver Producto</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="text-center justify-content-center my-5">
      <Col md={12}>
        <h2>Categorías Populares</h2>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Electrónica</Card.Title>
            <Link to='/categoria/electronica'>
              <Button variant="success">Ver Categoría</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Ropa</Card.Title>
            <Link to='/categoria/ropa'>
              <Button variant="success">Ver Categoría</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Hogar</Card.Title>
            <Link to='/categoria/hogar'>
              <Button variant="success">Ver Categoría</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Deportes</Card.Title>
            <Link to='/categoria/deportes'>
              <Button variant="success">Ver Categoría</Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="text-center justify-content-center my-5">
      <Col md={12}>
        <Link to='/productos'>
          <Button variant="outline-primary" size="lg">Ver Todos los Productos</Button>
        </Link>
      </Col>
    </Row>
  </Container>
  );
};

export default Home;