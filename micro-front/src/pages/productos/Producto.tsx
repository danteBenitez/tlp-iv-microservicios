import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { fetchProductById } from '../../store/services/productService';
import { IProduct } from '../../store/slices/productSlice';

const Producto: React.FC = () => {
  const { productoId } = useParams<{ productoId: string }>();
  const [producto, setProducto] = useState<IProduct>();

  useEffect(() => {
    const getProduct = async () => {
      if (!productoId) return;
      try {
        const data = await fetchProductById(productoId);
        setProducto(data);
      } catch (error) {
        console.error('Error fetching product by ID: ', error);
      }
    }
    getProduct();
  }, [productoId])

  if (!producto) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1>Producto: {producto.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{producto.name}</Card.Title>
              <Card.Text>{producto.description}</Card.Text>
              <Card.Text>Marca: {producto.brand}</Card.Text>
              <Card.Text>Tags: {producto.tags.join(', ')}</Card.Text>
              <Button variant="primary">Comprar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Producto;