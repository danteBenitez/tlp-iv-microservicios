import React from 'react';
import { Container, Row, Col, Card, Button, NavLink } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
import './home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  // const user = useSelector((state: RootState) => state.auth.user);

  const productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1', categoria: 'electronica', imagen: 'ruta/a/imagen1.jpg', top: 8 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2', categoria: 'ropa', imagen: 'ruta/a/imagen2.jpg', top: 5 },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del producto 3', categoria: 'hogar', imagen: 'ruta/a/imagen3.jpg', top: 9 },
    { id: 4, nombre: 'Producto 4', descripcion: 'Descripción del producto 4', categoria: 'deportes', imagen: 'ruta/a/imagen4.jpg', top: 7 },
  ];

  // Filtrar y ordenar productos por el campo 'top'
  const productosDestacados = productos
    .filter(producto => producto.top >= 7) // Filtrar productos con top >= 7
    .sort((a, b) => b.top - a.top) // Ordenar productos por top de mayor a menor

  return (
    <Container>
    <Row className="justify-content-center text-center my-5">
      <Col md={8}>
        <h1 className="display-4">Bienvenido a Nuestra Tienda <span className='text-success'>TeLoCompro</span></h1>
        <p className="lead">Encuentra los mejores productos al mejor precio.</p>
      </Col>
    </Row>
    <Row className="text-center justify-content-center">
        {productosDestacados.map(producto => (
          <Col md={4} key={producto.id}>
            <Card className="mb-4">
              <Card.Img variant="top" src={producto.imagen} />
              <Card.Body>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text>{producto.descripcion}</Card.Text>
                <NavLink as={Link} to={`/admin/productos/${producto.id}`}>
                  <Button variant="primary">Ver Producto</Button>
                </NavLink>
              </Card.Body>
            </Card>
          </Col>
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
            <NavLink as={Link} to='/admin/categoria/electronica'>
              <Button variant="success">Ver Categoría</Button>
            </NavLink>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Ropa</Card.Title>
            <NavLink as={Link} to='/admin/categoria/ropa'>
              <Button variant="success">Ver Categoría</Button>
            </NavLink>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Hogar</Card.Title>
            <NavLink as={Link} to='/admin/categoria/hogar'>
              <Button variant="success">Ver Categoría</Button>
            </NavLink>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Deportes</Card.Title>
            <NavLink as={Link} to='/admin/categoria/deportes'>
              <Button variant="success">Ver Categoría</Button>
            </NavLink>
          </Card.Body>
        </Card>
      </Col>
    </Row>
    <Row className="text-center justify-content-center my-5">
      <Col md={12}>
        <NavLink as={Link} to='/admin/productos'>
          <Button variant="outline-primary" size="lg">Ver Todos los Productos</Button>
        </NavLink>
      </Col>
    </Row>
  </Container>
  );
};

export default Home;