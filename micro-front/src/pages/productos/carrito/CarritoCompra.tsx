import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  FormControl,
  FormGroup,
  FormText,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";
import {
  buyAllFromShoppingCart,
  fetchShoppingCart,
} from "../../../store/slices/shippingCartSlice";
import { AppDispatch, RootState } from "../../../store/store";

const schema = z.object({
  address: z
    .string({
      message: "La dirección es requerida",
    })
    .min(1, {
      message: "La dirección es requerida",
    }),
});

export function CarritoCompraRealizada() {
  const token = useSelector((state: RootState) => state.auth.token);
  const cart = useSelector((state: RootState) => state.shoppingCart.cart);
  const loading = useSelector((state: RootState) => state.shoppingCart.loading);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShoppingCart());
  }, [dispatch, token]);

  if (!loading && cart.length == 0) {
    return <Navigate to="/admin/carrito/" />;
  }

  return (
    <Container>
      <h1 className="display-3">Compra de productos</h1>
      <div className="py-2">
        <FormGroup className="my-2 d-flex flex-column gap-2">
          <FormControl
            type="text"
            placeholder="Dirección de entrega"
            className="fs-4"
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
          <FormText className="fs-4">Ingrese la dirección de entrega</FormText>
          <FormText className="fs-4 text-danger">{error}</FormText>
        </FormGroup>
      </div>
      <p className="my-2 fs-4">
        Estás a punto de realizar una compra de los siguientes productos:
      </p>
      <Card>
        <CardBody>
          <Table className="fs-4">
            <tr>
              <td className="fw-medium">Producto</td>
              <td className="fw-medium">Cantidad</td>
            </tr>
            <tbody>
              {cart.map((c) => (
                <tr>
                  <td className="fw-medium">
                    <Link to={`/admin/productos/${c.product?._id}`}>
                      {c.product?.name}
                    </Link>
                  </td>
                  <td className="fw-medium">{c.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Button
            variant="success"
            onClick={() => {
              const { data, success, error } = schema.safeParse({ address });
              if (success) {
                dispatch(buyAllFromShoppingCart(data.address));
              } else {
                setError(error.formErrors.fieldErrors.address?.[0] ?? "");
              }
            }}
          >
            Confirmar
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
