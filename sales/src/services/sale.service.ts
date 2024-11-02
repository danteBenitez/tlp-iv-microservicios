import { BrokerAdapter, messageBrokerAdapter } from "../adapter/broker.adapter";
import { ISaleDetail } from "../interfaces/sale-detail.interface";
import { ISale } from "../interfaces/sale.interface";
import { IUser } from "../interfaces/user.interface";
import { ISaleRepository, saleRepository as saleRepository_ } from "../repositories/sale.repository";
import { ProductService, productService as productService_ } from "./product.service";
import { UsersService, usersService as usersService_ } from "./user.service";

export class SaleNotFoundError extends Error { }
export class ProductNotFoundError extends Error { }
export class ProductOutOfStockError extends Error { }
export class UserNotFoundError extends Error { }

type SaleDetailItem = Omit<ISaleDetail, "sellPrice" | "saleDetailId" | "saleId">;

export class SaleService {

    constructor(
        private brokerAdapter: BrokerAdapter = messageBrokerAdapter,
        private saleRepository: ISaleRepository = saleRepository_,
        private productService: ProductService = productService_,
        private userService: UsersService = usersService_,
    ) { }

    async findById(saleId: string) {
        const sale = await this.saleRepository.findById(saleId);

        if (!sale) {
            throw new SaleNotFoundError("La venta buscada no existe");
        }

        return {
            // FIXME: 
            // @ts-expect-error
            ...sale.dataValues,
            details: await Promise.all(sale.details?.map(async d => ({
                saleDetailId: d.saleDetailId,
                saleId: d.saleId,
                quantity: d.quantity,
                sellPrice: d.sellPrice,
                product: await this.productService.findById(d.productId)
            })) ?? [])
        };
    }

    async findForUser(userId: string) {
        const sales = await this.saleRepository.findForUser(userId);

        if (sales.length === 0) {
            throw new SaleNotFoundError("No existen ventas para este usuario");
        }

        return Promise.all(sales.map(async sale => {
            return {
                // FIXME: 
                // @ts-expect-error 
                ...sale.dataValues,
                details: await Promise.all(sale.details?.map(async d => ({
                    saleDetailId: d.saleDetailId,
                    saleId: d.saleId,
                    quantity: d.quantity,
                    sellPrice: d.sellPrice,
                    product: await this.productService.findById(d.productId)
                })) ?? [])
            }
        }))
    }

    async findAll() {
        const sales = await this.saleRepository.findAll();

        if (sales?.length === 0) {
            throw new SaleNotFoundError("No hay ventas");
        }

        return sales;
    }

    async sell(items: SaleDetailItem[], user: IUser, address: string): Promise<{ sale: ISale, total: number }> {
        // NOTE: En casos más precisos sería necesario un Mutex aquí, para evitar que
        //       se den condiciones de carrera.
        const details = await Promise.all(items.map(async saleItem => {
            const product = await this.productService.findById(saleItem.productId);
            if (!product) {
                throw new ProductNotFoundError("Producto no registrado");
            }

            if (product.stock < saleItem.quantity) {
                throw new ProductOutOfStockError(`Stock insuficiente para producto: ${product.name}`);
            }

            return {
                ...saleItem,
                product,
                sellPrice: product.price,
            }
        }));

        // Para evitar tener que hacer un rollback, sólo restamos el stock de productos
        // cuando verificamos que el stock es suficiente para todos los productos.
        for (const item of details) {
            const result = await this.productService.update(item.productId, { stock: item.product.stock - item.quantity });
            if (!result) {
                throw new Error(`No fue posible actualizar el producto: ${result}`);
            }
        }

        const found = await this.userService.findById(user.userId);

        if (!found) {
            throw new UserNotFoundError("Usuario no encontrado");
        }

        const sale = await this.create({
            dateSale: new Date(),
            userId: user.userId.toString()
        }, details);

        const total = details.reduce((acc, d) => acc + d.sellPrice * d.quantity, 0);

        this.brokerAdapter.sendToQueue("sold-items", {
            user,
            sale,
            address
        });

        return { sale, total };
    }

    private async create(saleData: Omit<ISale, "saleId">, detailsData: Omit<ISaleDetail, "saleDetailId" | "saleId">[]): Promise<ISale> {
        const sale = await this.saleRepository.create(saleData);

        await this.saleRepository.createDetails(sale.saleId, detailsData);

        return this.findById(sale.saleId);
    }
}

export const saleService = new SaleService();