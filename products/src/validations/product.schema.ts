import { isObjectIdOrHexString } from "mongoose";
import { z } from "zod";

const queryProductSchema = z.object({
    name: z.string(),
    price: z.number({ coerce: true }),
    brand: z.string(),
    tags: z.string().array().or(z.string()),
    description: z.string(),
    stock: z.number({ coerce: true }),
})

const orderProductSchema = z.object({
    orderField: z.enum(["name", "price", "tags", "brand", "price", "providerId"]),
    orderDirection: z.enum(["asc", "desc"])
}).partial()

const paginationProductSchema = z.object({
    page: z.number(),
    perPage: z.number()
}).partial()

export const findProductSchema = z.object({
    query: queryProductSchema.partial().and(orderProductSchema).and(paginationProductSchema)
}).partial();

export const productIdSchema = z.object({
    params: z.object({
        productId: z.string().refine((data: string) => {
            return isObjectIdOrHexString(data);
        }, {
            path: ["params"],
            message: "ID de producto inválido"
        })
    })
})

export const imageIdSchema = z.object({
    params: z.object({
        imageId: z.string().refine((data: string) => {
            return isObjectIdOrHexString(data);
        }, {
            path: ["params"],
            message: "ID de imagen inválido"
        })
    })
})

export const createProductSchema = z.object({
    name: z.string({
        message: "Un producto debe tener un nombre"
    }),
    price: z.number({
        message: "Un producto debe tener un precio",
        coerce: true
    }),
    brand: z.string({
        message: "Un producto debe tener una marca"
    }),
    tags: z.string({
        message: "Las etiquetas de un producto deben ser strings"
    }).array().or(z.string()).transform(data => {
        if (typeof data == "string") {
            return [data];
        }
        return data;
    }),
    description: z.string({
        message: "Un producto debe tener una descripción"
    }),
    images: z.object({
        id: z.string().refine(data => isObjectIdOrHexString(data), {
            message: "ID de imagen inválido"
        }),
        delete: z.boolean()
    }).array().optional(),
    stock: z.number({
        message: "Un producto debe tener un stock",
        coerce: true
    }).min(0, {
        message: "El stock no puede ser menor a 0"
    }),
});

export const updateProductSchema = z.object({
    body: createProductSchema.partial()
}).and(productIdSchema);