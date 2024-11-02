import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardImg,
  Col,
  Container,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import {
  FaMoneyBill,
  FaPencilAlt,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import productImagePlaceholder from "../../assets/img/product-placeholder.jpg";
import ConfirmAlert from "../../components/ConfirmAlert";
import { fetchProductById } from "../../store/services/productService";
import { IProduct, removeProduct } from "../../store/slices/productSlice";
import { addSale } from "../../store/slices/saleSlice";
import { editShoppingCart } from "../../store/slices/shippingCartSlice";
import { AppDispatch, RootState } from "../../store/store";
import { resolveImageUrl } from "../../utils/resolve-image-url";

const Producto: React.FC = () => {
  const { productoId } = useParams<{ productoId: string }>();
  const [producto, setProducto] = useState<IProduct>();
  const isAdmin = useSelector((state: RootState) =>
    state.auth?.user?.roles?.find((r) => r.name == "admin")
  );
  const cart = useSelector((state: RootState) => state.shoppingCart.cart);
  console.log(cart);

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

  if (!productoId || !producto) {
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
            <Link to={`/admin/productos/${productoId}/editar`}>
              <Button
                variant="primary"
                className="d-flex justify-content-center align-items-center fs-5 gap-2"
              >
                <FaPencilAlt></FaPencilAlt>
                Editar
              </Button>
            </Link>
            <DeleteButton productId={productoId} />
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
              <Card.Text>Stock: {producto.stock}</Card.Text>
              <Card.Text>
                Tags:{" "}
                {producto.tags.map((t) => (
                  <Badge>{t}</Badge>
                ))}
              </Card.Text>
            </Card.Body>
          </Card>
          <BuyButtonGroup productId={productoId} />
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

export function DeleteButton({ productId }: { productId: string }) {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div>
      <Button
        variant="danger"
        className="d-flex justify-content-center align-items-center fs-5 gap-2"
        onClick={async () => {
          setShowAlert(true);
        }}
      >
        <FaTrash></FaTrash>
        Eliminar
      </Button>
      <ConfirmAlert
        show={showAlert}
        title="¿Está seguro de que desea eliminar este producto?"
        message="Esta acción es irreversible"
        onConfirm={() => {
          dispatch(removeProduct(productId)).then((v) => {
            if (v) navigate("/admin/productos/");
          });
        }}
        onHide={() => setShowAlert(false)}
      />
    </div>
  );
}

export function BuyButtonGroup({ productId }: { productId: string }) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [quantity, setQuantity] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.shoppingCart.cart);
  const inCart = cart.find((c) => c.productId == productId);
  const isLoading = useSelector(
    (state: RootState) => state.shoppingCart.loading
  );
  const navigate = useNavigate();

  const handleBuy = () => {
    setAddress("");
  };

  const handleCompleteSell = async () => {
    await dispatch(
      addSale({
        address: address ?? "",
        items: [
          {
            productId,
            quantity,
          },
        ],
      })
    );
    navigate(0);
  };

  return (
    <div className="py-2 px-1">
      <div className="w-full d-flex gap-3">
        <Button
          variant="success"
          size="lg"
          className="d-flex align-items-center gap-2"
          disabled={quantity <= 0}
          onClick={handleBuy}
        >
          <FaMoneyBill />
          Comprar
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="d-flex align-items-center gap-2"
          disabled={quantity <= 0}
          onClick={() => {
            if (inCart) {
              dispatch(
                editShoppingCart([
                  { cartId: inCart.cartId, productId, quantity, delete: true },
                ])
              );
            } else {
              dispatch(editShoppingCart([{ productId, quantity }]));
            }
          }}
        >
          <FaShoppingCart />
          {!isLoading &&
            (inCart && inCart.quantity == quantity
              ? "Agregado"
              : "Agregar al carrito")}
          {isLoading && <p>Cargando...</p>}
        </Button>

        {isAuthenticated && (
          <ButtonGroup className="border border-3">
            <Button
              size="lg"
              variant="light"
              className="bg-white text-black border border-3"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
            <Button
              variant="light"
              disabled={true}
              size="lg"
              className="border-3"
            >
              {quantity}
            </Button>
            <Button
              size="lg"
              variant="light"
              className="bg-white text-black border border-3"
              onClick={() => setQuantity(quantity - 1)}
            >
              -
            </Button>
          </ButtonGroup>
        )}
      </div>
      {address != null ? (
        <div className="my-3 d-flex flex-column gap-2 justify-content-start">
          <FormLabel>Ingrese la dirección de envío</FormLabel>
          <FormControl
            type="text"
            className="fs-4"
            placeholder="New York, 255"
          />
          <Button
            variant="primary"
            size="lg"
            className="w-25"
            onClick={handleCompleteSell}
          >
            Completar
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default Producto;
