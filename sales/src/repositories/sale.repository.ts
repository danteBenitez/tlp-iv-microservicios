import { ISaleDetail } from "../interfaces/sale-detail.interface";
import { ISale } from "../interfaces/sale.interface";
import SaleDetail from "../models/sale-detail.model";
import Sale from "../models/sale.model";

export interface ISaleRepository {
    findById(saleId: string): Promise<ISale | null>;
    findAll(): Promise<ISale[] | null>;
    create(sale: Omit<ISale, "saleId">): Promise<ISale>
    createDetails(saleId: string, details: (Omit<ISaleDetail, "saleId" | "saleDetailId">)[]): Promise<ISaleDetail[] | null>
}

export class PostgresSaleRepository implements ISaleRepository {

    constructor(
        private saleModel: typeof Sale = Sale,
        private saleDetailModel: typeof SaleDetail = SaleDetail
    ) { }

    findById(saleId: string): Promise<ISale | null> {
        return this.saleModel.findByPk(saleId, {
            include: [this.saleDetailModel]
        });
    }

    findAll(): Promise<ISale[] | null> {
        return this.saleModel.findAll();
    }

    create(sale: Omit<ISale, "saleId">): Promise<ISale> {
        return this.saleModel.create(sale);
    }

    async createDetails(saleId: string, details: (Omit<ISaleDetail, "saleId" | "saleDetailId">)[]): Promise<ISaleDetail[] | null> {
        const sale = await this.saleModel.findByPk(saleId);

        if (!sale) {
            return null;
        }

        await this.saleDetailModel.bulkCreate(details.map(d => ({
            ...d,
            saleId
        })));

        return this.saleDetailModel.findAll({ where: { saleId } });
    }
}

export const saleRepository = new PostgresSaleRepository();