import { ISaleDetail } from "../interfaces/sale-detail.interface";
import { ISale } from "../interfaces/sale.interface";
import { IUser } from "../interfaces/user.interface";
import { ISaleRepository } from "../repositories/sale.repository";
import { ProductService } from "./product.service";

export class SaleNotFoundError extends Error { }
export class ProductNotFoundError extends Error { }
export class ProductOutOfStockError extends Error { }

type SaleDetailItem = Omit<ISaleDetail, "sellPrice" | "saleDetailId" | "saleId">;

export class SaleService {

    constructor(
        private saleRepository: ISaleRepository = saleRepository,
        private productService: ProductService = productService
    ) { }

    async findById(saleId: string) {
        const sale = await this.saleRepository.findById(saleId);

        if (!sale) {
            throw new SaleNotFoundError("La venta buscada no existe");
        }

        return sale;
    }

    async findAll() {
        const sales = await this.saleRepository.findAll();

        if (sales?.length === 0) {
            throw new SaleNotFoundError("No hay ventas");
        }

        return sales;
    }

    async sell(items: SaleDetailItem[], user: IUser): Promise<{ sale: ISale, total: number }> {
        const details = await Promise.all(items.map(async saleItem => {
            const product = await this.productService.findById(saleItem.productId);
            if (!product) {
                throw new ProductNotFoundError("Producto no registrado");
            }

            if (product.stock < saleItem.quantity) {
                throw new ProductOutOfStockError(`Stock insuficiente para producto: ${product.name}`);
            }

            await this.productService.update(product.id, { stock: product.stock - saleItem.quantity });

            return {
                ...saleItem,
                sellPrice: product.price,
            }
        }));

        const sale = await this.create({
            dateSale: new Date(),
            userId: user.userId.toString()
        }, details);

        const total = details.reduce((acc, d) => acc + d.sellPrice * d.quantity, 0);

        return { sale, total };
    }

    private async create(saleData: Omit<ISale, "saleId">, detailsData: Omit<ISaleDetail, "saleDetailId" | "saleId">[]): Promise<ISale> {
        const sale = await this.saleRepository.create(saleData);

        const details = await this.saleRepository.createDetails(sale.saleId, detailsData);

        return this.findById(sale.saleId);
    }
}