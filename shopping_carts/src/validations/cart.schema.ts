import { z } from "zod";

export const cartItemsSchema = z.object({
    cartId: z.string().optional(),
    delete: z.boolean().optional(),
    quantity: z.number({
        message: "La cantidad de producto debe ser un número"
    }).min(1, {
        message: "La cantidad debe ser mayor a 0"
    }),
    productId: z.string(),
}).array().refine(data => data.length >= 1, {
    message: "Debe agregar al menos un producto"
});