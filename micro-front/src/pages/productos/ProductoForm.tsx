import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import { z } from "zod";
import {
  addProduct,
  editProduct,
  IProduct,
} from "../../store/slices/productSlice";
import { AppDispatch } from "../../store/store";
import { formDataFromObject } from "../../utils/form-data-from-object";
import { resolveImageUrl } from "../../utils/resolve-image-url";
import "./ReactInputTags.css";

type ProductErrorMessages = {
  [k in keyof Omit<IProduct, "_id" | "images">]?: string[] | undefined;
};

type ProductForm = Omit<IProduct, "_id" | "images"> & {
  images: string[];
  deletedImages: string[];
};

const productSchema = z.object({
  name: z
    .string({
      message: "Un producto debe tener un nombre",
    })
    .min(1, {
      message: "Un producto debe tener un nombre",
    }),
  price: z
    .number({
      message: "Un producto debe tener un precio",
      coerce: true,
    })
    .min(0)
    .transform((p) => p.toString()),
  brand: z
    .string({
      message: "Un producto debe tener una marca",
    })
    .min(1, {
      message: "Un producto debe tener una marca",
    }),
  tags: z
    .string({
      message: "Las etiquetas de un producto deben ser strings",
    })
    .array()
    .or(z.string())
    .transform((data) => {
      if (typeof data == "string") {
        return [data];
      }
      return data;
    }),
  description: z.string({
    message: "Un producto debe tener una descripción",
  }),
  images: z.string().array().min(0),
  stock: z
    .number({
      message: "Un producto debe tener un stock",
      coerce: true,
    })
    .min(0, {
      message: "El stock no puede ser menor a 0",
    })
    .transform((s) => s.toString()),
});

export function ProductoForm({
  getValues,
  productId,
}: {
  getValues?: () => Promise<Omit<IProduct, "_id">>;
  productId?: string;
}) {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    brand: "",
    tags: [],
    images: [],
    deletedImages: [],
    stock: 0,
  });
  const [formErrors, setFormErrors] = useState<ProductErrorMessages>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const setDefaults = async () => {
      if (!getValues) return;
      const data = await getValues();
      console.log({ data });
      setForm({
        ...data,
        images: data.images.map((i) => i._id),
        deletedImages: [],
      });
    };
    setDefaults();
  }, [getValues]);

  const handleChange = async (name: string, value: string | string[]) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector(
      "[type=file]"
    ) as HTMLInputElement;
    const files = fileInput.files;
    try {
      const { success, error, data } = await productSchema.safeParseAsync({
        ...form,
        images: form.deletedImages,
      });
      if (data) {
        const formData = formDataFromObject(data);
        if (files) {
          for (const file of files) {
            formData.append("productImage", file);
          }
        }
        if (productId) {
          if (await dispatch(editProduct(productId, formData)))
            navigate(`/admin/productos/${productId}`);
        } else {
          if (await dispatch(addProduct(formData)))
            navigate(`/admin/productos/`);
        }
      }
      if (!success && error?.formErrors) {
        if (error.formErrors) setFormErrors(error.formErrors.fieldErrors);
      }
      console.log(error, form);
    } catch (err) {
      console.log("asdasd", err);
    }
  };

  return (
    <Form className="fs-3" onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre de producto</Form.Label>
        <Form.Control
          type="text"
          placeholder="Producto"
          className="fs-4"
          defaultValue={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("name", e.target.value)
          }
        />
        <Form.Text className="text-danger">
          {formErrors?.name?.[0] ?? null}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          defaultValue={form.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleChange("description", e.currentTarget.value)
          }
          placeholder="Descripción"
          className="fs-4"
        />
        <Form.Text className="text-danger">
          {formErrors?.description?.[0]}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Row md={12} className="w-full">
          <Col md={6}>
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              placeholder="Precio"
              className="fs-4"
              defaultValue={form.price}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("price", e.currentTarget.value)
              }
            />
            <Form.Text className="text-danger">
              {formErrors?.price?.[0]}
            </Form.Text>
          </Col>
          <Col md={6}>
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              name="brand"
              placeholder="Marca"
              className="fs-4"
              defaultValue={form.brand}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("brand", e.currentTarget.value)
              }
            />
            <Form.Text className="text-danger">
              {formErrors?.brand?.[0]}
            </Form.Text>
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-3">
        <Row md={12} className="w-full">
          <Col md={6}>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              placeholder="Unidades"
              className="fs-4"
              value={form.stock}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("stock", e.currentTarget.value)
              }
            />
            <Form.Text className="text-danger">
              {formErrors?.stock?.[0]}
            </Form.Text>
          </Col>
        </Row>
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Etiquetas</Form.Label>
        <ReactTags
          tags={form.tags.map((t) => ({ id: t, text: t, className: "" }))}
          separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
          handleDelete={(i) => {
            form.tags.splice(i, 1);
            const spliced = [...form.tags];
            handleChange("tags", spliced);
          }}
          allowDragDrop={false}
          handleAddition={(t) => handleChange("tags", [...form.tags, t.id])}
          placeholder="Etiqueta"
          inputFieldPosition="inline"
          maxTags={7}
        />
        <Form.Text className="text-danger">{formErrors?.tags?.[0]}</Form.Text>
      </Form.Group>
      <Form.Group className="mb-3 mt-2">
        <Form.Label>Imágenes de producto</Form.Label>
        <div className="max-w-full">
          {form.images.map((i) => {
            return (
              <div className="position-relative">
                <img
                  src={resolveImageUrl(i)}
                  className="object-fit-cover"
                  style={{ maxHeight: 350 }}
                />
                <FaTrash
                  className="position-absolute m-2 cursor-pointer"
                  style={{ top: 0, left: 0 }}
                  onClick={() => {
                    setForm({
                      ...form,
                      deletedImages: [...form.deletedImages, i],
                      images: form.images.filter((img) => img != i),
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
        <Form.Control
          type="file"
          name="productImage"
          multiple={true}
          className="fs-4 mt-3"
        />
      </Form.Group>
      <Button variant="success" type="submit" className="fs-2 px-3 py-2 mt-3">
        Enviar
      </Button>
    </Form>
  );
}
