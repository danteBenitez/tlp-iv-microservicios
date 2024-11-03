import { IPurchaseDetail } from "../interfaces/purchase-detail.interface";
import { IPurchase } from "../interfaces/purchase.interface";
import { ISupplier } from "../interfaces/supplier.interface";
import { IUser } from "../interfaces/user.interface";
import {
  IPurchaseRepository,
  purchaseRepository as purchaseRepository_,
} from "../repositories/purchase.repository";
import {
  ProductService,
  productService as productService_,
} from "./product.service";
import {
  SupplierService,
  supplierService as supplierService_,
} from "./supplier.service";

export class PurchaseNotFoundError extends Error {}
export class ProductNotFoundError extends Error {}
export class ProductOutOfStockError extends Error {}
export class SupplierNotFoundError extends Error {}

type PurchaseDetailItem = Omit<
  IPurchaseDetail,
  "purchaseDetailId" | "purchaseId"
>;

export class PurchaseService {
  constructor(
    private purchaseRepository: IPurchaseRepository = purchaseRepository_,
    private productService: ProductService = productService_,
    private supplierService: SupplierService = supplierService_
  ) {}

  async findById(PurchaseId: string) {
    const purchase = await this.purchaseRepository.findById(PurchaseId);

    if (!purchase) {
      throw new PurchaseNotFoundError("La compra buscada no existe");
    }

    return purchase;
  }

  async findAll() {
    const purchases = await this.purchaseRepository.findAll();

    if (!purchases) {
      return [];
    }

    return Promise.all(
      purchases.map(async (purchase) => {
        return {
          //@ts-expect-error
          ...purchase.dataValues,
          supplier: await this.supplierService.findById(purchase.supplierId),
          details: await Promise.all(
            purchase.details?.map(async (d) => ({
              purchaseDetailId: d.purchaseDetailId,
              quantity: d.quantity,
              costPrice: d.costPrice,
              purchaseId: d.purchaseId,
              productId: d.productId,
              product: await this.productService.findById(d.productId),
            })) ?? []
          ),
        };
      })
    );
  }

  async buy(
    items: PurchaseDetailItem[],
    supplierId: string
  ): Promise<{ purchase: IPurchase; total: number }> {
    const details = await Promise.all(
      items.map(async (purchaseItem) => {
        const product = await this.productService.findById(
          purchaseItem.productId
        );

        if (!product) {
          throw new ProductNotFoundError("Producto no encontrado.");
        }

        return {
          ...purchaseItem,
          product,
        };
      })
    );

    // Para evitar tener que hacer un rollback, sólo sumamos el stock de productos
    // cuando verificamos que el stock es suficiente para todos los productos.
    for (const item of details) {
      const result = await this.productService.update(item.productId, {
        stock: item.product?.stock
          ? item.product?.stock + item.quantity
          : item.quantity,
      });
      if (!result) {
        throw new Error(`No fue posible actualizar el producto: ${result}`);
      }
    }

    const found = await this.supplierService.findById(supplierId);

    if (!found) {
      throw new SupplierNotFoundError("Proveedor no encontrado");
    }

    const data = {
      datePurchase: new Date(),
      supplierId: found.supplierId,
      details,
    } as Omit<IPurchase, "purchaseId">;

    const purchase = await this.create(data);

    const total = details.reduce((acc, d) => acc + d.costPrice * d.quantity, 0);

    return { purchase, total };
  }

  private async create(
    purchaseData: Omit<IPurchase, "purchaseId">
  ): Promise<IPurchase> {
    const purchase = await this.purchaseRepository.create(purchaseData);

    await this.purchaseRepository.createDetails(
      purchase.purchaseId,
      purchaseData.details
    );

    return this.findById(purchase.purchaseId);
  }
}

export const purchaseService = new PurchaseService();
