import React, { useEffect, useState } from "react";
import { Button, Card, CardImg, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import productImagePlaceholder from "../../assets/img/product-placeholder.jpg";
import { fetchProductById } from "../../store/services/productService";
import { IProduct } from "../../store/slices/productSlice";
import { resolveImageUrl } from "../../utils/resolve-image-url";

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
        console.error("Error fetching product by ID: ", error);
      }
    };
    getProduct();
  }, [productoId]);

  if (!producto) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5">
      {producto.images[0] ? (
        <CardImg
          src={resolveImageUrl(
            producto.images[0]._id ?? productImagePlaceholder
          )}
        ></CardImg>
      ) : (
        <CardImg src={productImagePlaceholder}></CardImg>
      )}
      <Row>
        <Col>
          <h1>Producto: {producto.name}</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="">{producto.name}</Card.Title>
              <Card.Text>{producto.description}</Card.Text>
              <Card.Text>Marca: {producto.brand}</Card.Text>
              <Card.Text>Tags: {producto.tags.join(", ")}</Card.Text>
              <Button variant="primary">Comprar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Producto;
