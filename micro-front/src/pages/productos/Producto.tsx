import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardImg,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import productImagePlaceholder from "../../assets/img/product-placeholder.jpg";
import { fetchProductById } from "../../store/services/productService";
import { IProduct, removeProduct } from "../../store/slices/productSlice";
import { AppDispatch, RootState } from "../../store/store";
import { resolveImageUrl } from "../../utils/resolve-image-url";

const Producto: React.FC = () => {
  const { productoId } = useParams<{ productoId: string }>();
  const [producto, setProducto] = useState<IProduct>();
  const isAdmin = useSelector((state: RootState) =>
    state.auth?.user?.roles?.find((r) => r.name == "admin")
  );
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

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
  });

  if (!producto) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-5 fs-3">
      {producto.images[0] ? (
        <CardImg
          style={{ maxHeight: 300, objectFit: "cover" }}
          src={resolveImageUrl(producto.images[0]._id)}
        ></CardImg>
      ) : (
        <CardImg
          style={{ maxHeight: 300, objectFit: "cover" }}
          src={productImagePlaceholder}
        ></CardImg>
      )}
      <Row className="p-4">
        <Col md={9}>
          <h1 className="fs-1 fw-bolder">Producto: {producto.name}</h1>
        </Col>
        {isAdmin ? (
          <Col md={3} className="d-flex align-items-center gap-2">
            <Button
              variant="danger"
              className="d-flex justify-content-center align-items-center fs-5 gap-2"
              onClick={async () => {
                dispatch(removeProduct(producto._id));
                navigate("/admin/productos/");
              }}
            >
              <FaTrash></FaTrash>
              Eliminar
            </Button>
            <Link to={`/admin/productos/${productoId}/editar`}>
              <Button
                variant="primary"
                className="d-flex justify-content-center align-items-center fs-5 gap-2"
              >
                <FaPencilAlt></FaPencilAlt>
                Editar
              </Button>
            </Link>
          </Col>
        ) : null}
      </Row>
      <Row className="p-2">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Text className="text-muted">
                {producto.description}
              </Card.Text>
              <Card.Text>Marca: {producto.brand}</Card.Text>
              <Card.Text>
                Tags:{" "}
                {producto.tags.map((t) => (
                  <Badge>{t}</Badge>
                ))}
              </Card.Text>
              <Button variant="primary" size="lg">
                Comprar
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {producto.images.length !== 0 ? (
        <Row className="my-5">
          <h3 className="display-6">Imágenes</h3>
          <div className="max-w-full" style={{ maxWidth: 350 }}>
            {producto.images.map((img) => {
              return (
                <CardImg
                  style={{ objectFit: "contain" }}
                  src={resolveImageUrl(img._id ?? productImagePlaceholder)}
                  className="img-fluid"
                ></CardImg>
              );
            })}
          </div>
        </Row>
      ) : null}
    </Container>
  );
};

export default Producto;
