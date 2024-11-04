import { IPurchaseDetail } from "./purchase-detail.interface"

export interface IPurchase {
    purchaseId: string,
    datePurchase: Date,
    supplierId: string
    details: IPurchaseDetail[]
}