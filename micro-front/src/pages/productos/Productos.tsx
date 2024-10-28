import React from 'react';
import { Container, Row, Col, Card, Button, NavLink } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

const Productos: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();

  const productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1', categoria: 'electronica', imagen: 'ruta/a/imagen1.jpg', top: 8 },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2', categoria: 'ropa', imagen: 'ruta/a/imagen2.jpg', top: 5 },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del producto 3', categoria: 'hogar', imagen: 'ruta/a/imagen3.jpg', top: 9 },
    { id: 4, nombre: 'Producto 4', descripcion: 'Descripción del producto 4', categoria: 'deportes', imagen: 'ruta/a/imagen4.jpg', top: 7 },
  ];

  const productosFiltrados = categoriaId ? productos.filter(producto => producto.categoria === categoriaId) : productos;

  return (
    <Container className="my-5">
      <Row>
        <Col>
        <h1>{categoriaId ? `Productos de la categoría: ${categoriaId}` : 'Todos los Productos'}</h1>
        </Col>
      </Row>
      <Row>
        {productosFiltrados.map(producto => (
          <Col md={4} key={producto.id}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text>{producto.descripcion}</Card.Text>
                <NavLink as={Link} to={`${producto.id}`}>
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