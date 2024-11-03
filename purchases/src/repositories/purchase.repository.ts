import { IPurchaseDetail } from "../interfaces/purchase-detail.interface";
import { IPurchase } from "../interfaces/purchase.interface";
import PurchaseDetail from "../models/purchase-detail.model";
import Purchase from "../models/purchase.model";

export interface IPurchaseRepository {
  findById(purchaseId: string): Promise<IPurchase | null>;
  findAll(): Promise<IPurchase[] | null>;
  create(sale: Omit<IPurchase, "purchaseId">): Promise<IPurchase>;
  createDetails(
    purchaseId: string,
    details: Omit<IPurchaseDetail, "purchaseId" | "purchaseDetailId">[]
  ): Promise<IPurchaseDetail[] | null>;
}

export class PostgresPurchaseRepository implements IPurchaseRepository {
  constructor(
    private purchaseModel: typeof Purchase = Purchase,
    private purchaseDetailModel: typeof PurchaseDetail = PurchaseDetail
  ) {}

  findById(purchaseId: string): Promise<IPurchase | null> {
    return this.purchaseModel.findByPk(purchaseId, {
      include: [this.purchaseDetailModel],
    });
  }

  findAll(): Promise<IPurchase[] | null> {
    return this.purchaseModel.findAll({
      include: [this.purchaseDetailModel],
      order: [["datePurchase", "DESC"]],
    });
  }

  create(purchase: Omit<IPurchase, "purchaseId">): Promise<IPurchase> {
    return this.purchaseModel.create(purchase);
  }

  async createDetails(
    purchaseId: string,
    details: Omit<IPurchaseDetail, "purchaseId" | "purchaseDetailId">[]
  ): Promise<IPurchaseDetail[] | null> {
    const purchase = await this.purchaseModel.findByPk(purchaseId);

    if (!purchase) {
      return null;
    }

    await this.purchaseDetailModel.bulkCreate(
      details.map((d) => ({
        ...d,
        purchaseId,
      }))
    );

    return this.purchaseDetailModel.findAll({ where: { purchaseId } });
  }
}

export const purchaseRepository = new PostgresPurchaseRepository();
