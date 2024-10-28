import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, NavLink } from 'react-bootstrap';

const Categoria: React.FC = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  console.log('categoriaId', categoriaId);
  const productos = [
    { id: 1, nombre: 'Producto 1', descripcion: 'Descripción del producto 1', categoria: 'electronica' },
    { id: 2, nombre: 'Producto 2', descripcion: 'Descripción del producto 2', categoria: 'ropa' },
    { id: 3, nombre: 'Producto 3', descripcion: 'Descripción del producto 3', categoria: 'hogar' },
    { id: 4, nombre: 'Producto 4', descripcion: 'Descripción del producto 4', categoria: 'deportes' },
  ];

  const productosFiltrados = productos.filter(producto => producto.categoria === categoriaId);

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>Categoría: {categoriaId}</h1>
        </Col>
      </Row>
      <Row>
        {productosFiltrados.map(producto => (
          <Col md={4} key={producto.id}>
            <Card className="mb-4">
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
    </Container>
  );
};

export default Categoria;