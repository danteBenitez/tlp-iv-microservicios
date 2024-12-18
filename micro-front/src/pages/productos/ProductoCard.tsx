import { ReactNode } from "react";
import { Badge, Button, Card, Col, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import productImagePlaceholder from "../../assets/img/product-placeholder.jpg";
import { IProduct } from "../../store/slices/productSlice";
import { resolveImageUrl } from "../../utils/resolve-image-url";

export function ProductoCard({
  producto,
  bottomRight,
}: {
  producto: IProduct;
  bottomRight?: ReactNode;
}) {
  return (
    <Col md={4} key={producto._id}>
      <Card className="mb-4">
        {producto.images.length > 0 ? (
          <Card.Img src={resolveImageUrl(producto.images[0]._id)}></Card.Img>
        ) : (
          <Card.Img
            src={productImagePlaceholder}
            className="object-fit-cover"
          />
        )}
        <Card.Body className="fs-5">
          <div className="d-flex align-items-center gap-2">
            <Card.Title className="fw-bold fs-1">
              {producto.name.slice(0, 10)}
            </Card.Title>
            <Card.Text className="fs-3">
              <Badge className="bg-success">${producto.price}</Badge>
            </Card.Text>
          </div>
          <Card.Text>{producto.description}</Card.Text>
          <Card.Text>{producto.brand}</Card.Text>
          <Card.Text>
            Tags:{" "}
            {producto.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Card.Text>
          <Card.Text>Stock: {producto.stock}</Card.Text>
          <Card.Text>Id: {producto._id}</Card.Text>
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              as={Link}
              to={`/admin/productos/${producto._id}`}
              className="w-full"
            >
              <Button variant="primary" className="w-full">
                Ver Producto
              </Button>
            </NavLink>
            {bottomRight}
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}
