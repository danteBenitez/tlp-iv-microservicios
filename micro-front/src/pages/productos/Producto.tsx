import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Producto: React.FC = () => {
  const { productoId } = useParams<{ productoId: string }>();
  const producto = { id: productoId, nombre: 'Nombre del Producto', descripcion: 'Descripción detallada del producto.' };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>Producto: {producto.nombre}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{producto.nombre}</Card.Title>
              <Card.Text>{producto.descripcion}</Card.Text>
              <Button variant="primary">Comprar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Producto;