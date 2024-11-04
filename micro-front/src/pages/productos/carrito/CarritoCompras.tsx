import { useEffect } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import { FaMoneyBill } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  editShoppingCart,
  fetchShoppingCart,
} from "../../../store/slices/shippingCartSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { ProductoCard } from "../ProductoCard";

export function CarritoCompras() {
  const token = useSelector((state: RootState) => state.auth.token);
  const cart = useSelector((state: RootState) => state.shoppingCart.cart);
  const dispatch: AppDispatch = useDispatch();

  const onDelete = async (cartId: string, productId: string) => {
    dispatch(
      editShoppingCart([{ quantity: 1, delete: true, cartId, productId }])
    );
    dispatch(fetchShoppingCart());
  };

  useEffect(() => {
    dispatch(fetchShoppingCart());
  }, [dispatch, token]);

  return (
    <Container>
      <Row>
        <Col md={9}>
          <h1 className="mb-3">Carrito de compras</h1>
        </Col>
        {cart.length != 0 && (
          <Col md={3}>
            <Link to={"/admin/carrito/compra"}>
              <Button
                variant="success"
                size="lg"
                className="d-flex align-items-center gap-2"
              >
                <FaMoneyBill />
                Comprar todo
              </Button>
            </Link>
          </Col>
        )}
      </Row>
      {cart.length === 0 ? <p>Por ahora no tienes ningún producto</p> : null}
      <div className="d-flex gap-2">
        {cart.map((c) => {
          return (
            <ProductoCard
              producto={c.product}
              bottomRight={
                <div className="d-flex gap-2 align-items-center">
                  <Badge className="bg-success">Cantidad {c.quantity}</Badge>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(c.cartId, c.productId)}
                  >
                    Quitar
                  </Button>
                </div>
              }
            />
          );
        })}
      </div>
    </Container>
  );
}
