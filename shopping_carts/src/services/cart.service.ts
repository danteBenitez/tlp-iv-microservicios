import { ICart } from "../interfaces/cart.interface";
import { cartRepository, ICartRepository } from "../repository/cart.repository";
import { ProductService, productService as productService_ } from "./product.service";
import { SaleService, saleService as saleService_ } from "./sale.service";

export type CartItem = { cartId?: string, productId: string, quantity: number, delete?: boolean };

export class CartNotFoundError extends Error { }
export class ProductNotFoundError extends Error { }
export class CouldNotBuyError extends Error { }

export class CartService {
    constructor(
        private repository: ICartRepository = cartRepository,
        private productService: ProductService = productService_,
        private saleService: SaleService = saleService_
    ) { }

    async findAllForUser(userId: string) {
        const found = await this.repository.findAllForUser(userId);
        if (!found) throw new CartNotFoundError("El usuario no tiene productos en su carrito");
        return Promise.all(found.map(async f => {
            return {
                // @ts-ignore
                // FIXME: 
                ...f.dataValues,
                product: await this.productService.findById(f.productId)
            }
        }));
    }

    async addToCartOf(userId: string, items: CartItem[]): Promise<ICart[]> {
        const products = await Promise.all(items.map(async item => {
            if (item.cartId) {
                if (item.delete) {
                    console.log("deleting item...");
                    const product = await this.repository.delete(userId, item.cartId);
                    if (!product) throw new CartNotFoundError("Carrito no encontrado");
                    return product;
                }
                const product = await this.productService.findById(item.productId);
                if (!product) throw new ProductNotFoundError("Producto no encontrado");

                const cartItem = await this.repository.update(userId, item);
                if (!cartItem) throw new CartNotFoundError("Carrito no encontrado");
                return cartItem;
            }
            const product = await this.productService.findById(item.productId);
            if (!product) throw new ProductNotFoundError("Producto no encontrado");

            return await this.repository.create(userId, {
                ...item,
            });
        }));

        return products;
    }

    async buyAllCart(userId: string, address: string) {
        const cart = await this.repository.findAllForUser(userId);
        const response = await this.saleService.sell(userId, cart, address);
        console.log(response);
        if (!response) throw new CouldNotBuyError("No fue posible realizar la compra");
        await this.repository.clear(userId);
        return response;
    }
}

export const cartService = new CartService();