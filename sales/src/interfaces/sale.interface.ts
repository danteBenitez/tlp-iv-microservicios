import { ISaleDetail } from "./sale-detail.interface"

export interface ISale {
    saleId: string,
    dateSale: Date,
    userId: string
    details?: ISaleDetail[]
}