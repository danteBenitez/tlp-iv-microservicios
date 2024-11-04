import { z } from "zod";
import { IPurchaseDetail } from "../interfaces/purchase-detail.interface";

type PurchaseDetailItem = Omit<IPurchaseDetail, "purchaseDetailId" | "purchaseId">;

// datePurchase: Date,
// supplierId: string
export const purchaseDetailSchema = z.object({
    productId: z.string({
        message: "El ID de producto debe ser un string"
    }),
    costPrice: z.number({
        message: "El precio de compra debe ser un número"
    }).min(1, {
        message: "El precio de compra debe ser mayor o igual a 1"
    }),
    quantity: z.number({
        message: "La cantidad debe ser un número"
    }).min(1, {
        message: "La cantidad a comprar debe ser mayor o igual 1"
    })
}).array().refine(data => {
    return data.length >= 1;
}, {
    message: "Debe comprar al menos un producto"
})

export const purchaseIdSchema = z.object({
    params: z.object({
        purchaseId: z.string({
            message: "ID de compra inválido"
        })
    })
})

export const purchaseSchema = z.object({
    supplierId: z.string({
        message: "El ID de proveedor es requerido"
    }).uuid(),
    datePurchase: z.string({
        message: "La fecha de compra es requerida"
    }),
    details: purchaseDetailSchema
})

