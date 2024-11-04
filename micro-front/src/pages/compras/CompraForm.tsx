import { useEffect, useMemo, useState } from "react";
import { Row, Col, Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import {
  addPurchase,
  IPurchase,
  IPurchaseDetail,
} from "../../store/slices/purchaseSlice";
import { z } from "zod";
import { fetchAllSuppliers } from "../../store/slices/supplierSlice";
import { fetchAllProducts } from "../../store/slices/productSlice";
import { FaPlus, FaTrash } from "react-icons/fa";

type PurchaseErrorMessages = {
  [k in keyof Omit<IPurchase, "purchaseId">]?: string[] | undefined;
};

type PurchaseDetailErrorMessages = {
  [k in keyof IPurchaseDetail]?: string[] | undefined;
};

const purchaseDetailSchema = z.object({
  productId: z.string({
    message: "El ID de producto debe ser un string",
  }),
  costPrice: z
    .number({
      message: "El precio de compra debe ser un número",
    })
    .min(1, {
      message: "El precio de compra debe ser mayor o igual a 1",
    }),

  quantity: z
    .number({
      message: "La cantidad debe ser un número",
    })
    .min(1, {
      message: "La cantidad a comprar debe ser mayor o igual 1",
    }),
});

const purchaseDetailsSchema = purchaseDetailSchema.array().refine(
  (data) => {
    return data.length >= 1;
  },
  {
    message: "Debe comprar al menos un producto",
  }
);

const purchaseSchema = z.object({
  supplierId: z
    .string({
      message: "El ID de proveedor es requerido",
    })
    .uuid(),
  datePurchase: z.string({
    message: "La fecha de compra es requerida",
  }),
  details: purchaseDetailsSchema,
});

export default function CompraForm({
  getValues,
  purchaseId,
}: {
  getValues?: () => Promise<Omit<IPurchase, "purchaseId">>;
  purchaseId?: string;
}) {
  void getValues;
  void purchaseId;

  const navigation = useNavigate();

  const suppliers = useSelector(
    (state: RootState) => state.suppliers.suppliers
  );
  const products = useSelector((state: RootState) => state.products.products);

  const dispatch: AppDispatch = useDispatch();
  const [form, setForm] = useState<Omit<IPurchase, "purchaseId">>({
    datePurchase: new Date(),
    supplierId: "",
    details: [] as IPurchaseDetail[],
  } as Omit<IPurchase, "purchaseId">);

  useEffect(() => {
    const setDefaults = async () => {
      if (!getValues) return;
      const data = await getValues();
      setForm(data);
    };
    setDefaults();
  }, [getValues]);

  useEffect(() => {
    dispatch(fetchAllSuppliers());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const [formErrors, setFormErrors] = useState<PurchaseErrorMessages>();

  const handleChange = async (
    name: string,
    value: string | string[] | Date | IPurchaseDetail
  ) => {
    if (value instanceof Date) {
      return setForm({ ...form, [name]: new Date(value) });
    }

    if (name === "details") {

      const d = form.details.find((d) => d.productId === (value as IPurchaseDetail).productId);

      // Si ya existe, reemplazar  el valor
      if (d) {
        const details = form.details.map((d) => {
          if (d.productId === (value as IPurchaseDetail).productId) {
            return value as IPurchaseDetail;
          }
          return d;
        });
        return setForm({ ...form, [name]: details });
      }
      

      return setForm({
        ...form,
        [name]: [...form.details, value as IPurchaseDetail],
      });
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { success, error, data } = await purchaseSchema.safeParseAsync(
        form
      );

      console.log({ success, error, data });

      if (data) {
        await dispatch(
          addPurchase({ ...data, datePurchase: new Date(data.datePurchase) })
        );
      }

      if (!success && error?.formErrors) {
        if (error.formErrors) setFormErrors(error.formErrors.fieldErrors);
        return;
      }
      navigation("/admin/compras");
    } catch (err) {
      console.log("Error al crear proveedor", err);
    }
  };

  const PRODUCT_NAME = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p._id] = p.name;
      return acc;
    }, {} as { [k: string]: string });
  }, [products]);

  console.log({ CompraForm: form });

  return (
    <Form className="fs-3" onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de compra</Form.Label>
            <Form.Control
              type="datetime-local"
              placeholder="Fecha de compra"
              className="fs-4"
              defaultValue={new Date(form.datePurchase).toISOString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log(e.target.value);

                handleChange("datePurchase", e.target.value);
              }}
            />
            <Form.Text className="text-danger">
              {formErrors?.datePurchase?.[0] ?? null}
            </Form.Text>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Proveedor</Form.Label>
            <Form.Select
              className="fs-4"
              defaultValue={form.supplierId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleChange("supplierId", e.target.value)
              }
            >
              <option value="">Seleccione un proveedor</option>
              {suppliers.map((s) => (
                <option key={s.supplierId} value={s.supplierId}>
                  {s.companyName}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-danger">
              {formErrors?.supplierId?.[0] ?? null}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      <DetailProducts handleChange={handleChange} />
      <Row>
        <Table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio de compra</th>
              <th>Subtotal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {form.details.map((d, i) => (
              <tr key={i}>
                <td>{PRODUCT_NAME[d.productId]}</td>
                <td>{d.quantity}</td>
                <td>{d.costPrice}</td>
                <td>{d.costPrice * d.quantity}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => {
                      const details = form.details.filter(
                        (_, index) => index !== i
                      );
                      setForm({ ...form, details });
                    }}
                  >
                    <FaTrash></FaTrash>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>

      <Button variant="success" type="submit" className="fs-5 px-3 py-2 mt-3">
        Ingresar
      </Button>
    </Form>
  );
}

function DetailProducts({
  handleChange,
}: {
  handleChange: (name: string, values: IPurchaseDetail) => void;
}) {
  const products = useSelector((state: RootState) => state.products.products);

  const [form, setForm] = useState<IPurchaseDetail>({
    productId: "",
    costPrice: 0,
    quantity: 0,
  });

  const [formErrors, setFormErrors] = useState<PurchaseDetailErrorMessages>();

  const addProduct = async () => {
    const { success, error, data } = await purchaseDetailSchema.safeParseAsync(
      form
    );

    if (data) {
      handleChange("details", data);
      setForm({ productId: "", costPrice: 0, quantity: 0 });
    }
    if (!success && error?.formErrors) {
      if (error.formErrors) setFormErrors(error.formErrors.fieldErrors);
    }
  };

  return (
    <Row>
      <Col md={6}>
        <Form.Group className="mb-3">
          <Form.Label>Producto</Form.Label>
          <Form.Select
            className="fs-4"
            value={form.productId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const productId = e.target.value;
              const product = products.find((p) => p._id === productId);
              if (!product) return;

              setForm({ ...form, productId: product._id });
            }}
          >
            <option value="">Seleccione un producto</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-danger">{formErrors?.productId}</Form.Text>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Row className="justify-content-between">
          <Col>
            <Form.Group className="mb-3 w-100">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="costPrice"
                placeholder="0"
                className="fs-4"
                value={form.costPrice}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({
                    ...form,
                    costPrice: parseFloat(e.currentTarget.value),
                  })
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.quantity?.[0]}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                placeholder="0"
                className="fs-4"
                value={form.quantity}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({
                    ...form,
                    quantity: parseInt(e.currentTarget.value),
                  })
                }
              />
              <Form.Text className="text-danger">
                {formErrors?.quantity?.[0]}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col>
            <Button
              variant="primary"
              type="button"
              className="fs-5 px-3 py-2 mt-3"
              onClick={addProduct}
            >
              <FaPlus></FaPlus>
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
