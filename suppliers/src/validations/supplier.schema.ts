import { z } from "zod";

const querySupplierSchema = z.object({
  companyName: z.string(),
});

const orderSupplierSchema = z
  .object({
    orderField: z.enum([
      "name",
      "price",
      "tags",
      "brand",
      "price",
      "providerId",
    ]),
    orderDirection: z.enum(["asc", "desc"]),
  })
  .partial();

const paginationSupplierSchema = z
  .object({
    page: z.number(),
    perPage: z.number(),
  })
  .partial();

export const findSupplierSchema = z
  .object({
    query: querySupplierSchema
      .partial()
      .and(orderSupplierSchema)
      .and(paginationSupplierSchema),
  })
  .partial();

export const SupplierIdSchema = z.object({
  params: z.object({
    supplierId: z
      .string({
        message: "ID de proveedor inválido",
      })
      .uuid({
        message: "ID de proveedor inválido",
      }),
  }),
});

export const createSupplierSchema = z.object({
  companyName: z.string().min(1, {
    message: "El nombre de la empresa es requerido",
  }),
  cuit: z.string().min(1, {
    message: "El CUIT es requerido",
  }),
  phoneNumber: z.string().min(1, {
    message: "El número de teléfono es requerido",
  }),
  address: z.string().min(1, {
    message: "La dirección es requerida",
  }),
  email: z
    .string()
    .min(1, {
      message: "El correo electrónico es requerido",
    })
    .email({
      message: "Correo electrónico no es válido",
    }),
});

export const createUserByAdminSchema = z.object({
  body: createSupplierSchema,
});

export const updateSupplierSchema = z.object({
  body: createSupplierSchema.partial(),
});

export type UpdateSupplierData = z.infer<typeof updateSupplierSchema>["body"];

export type CreateSupplierData = z.infer<typeof createUserByAdminSchema>["body"];
