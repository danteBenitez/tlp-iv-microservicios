import { z } from "zod";
import { ISaleDetail } from "../interfaces/sale-detail.interface";

type SaleDetailItem = Omit<ISaleDetail, "sellPrice" | "saleDetailId" | "saleId">;

export const saleItemSchema = z.object({
    productId: z.string({
        message: "El ID de producto debe ser un string"
    }),
    quantity: z.number({
        message: "La cantidad debe ser un número"
    }).min(1, {
        message: "La cantidad a comprar debe ser mayor o igual 1"
    }),
}).array().refine(data => {
    return data.length >= 1;
}, {
    message: "Debe comprar al menos un producto"
})

export const saleSchema = z.object({
    items: saleItemSchema,
    address: z.string({
        message: "Debe proporcionar una dirección para el envío"
    })
})

export const saleIdSchema = z.object({
    params: z.object({
        saleId: z.string({
            message: "ID de venta inválido"
        })
    })
})