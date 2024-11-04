import { ICart } from "../interfaces/cart.interface";
import ShoppingCart from "../models/shopping-cart.model";
import { CartItem } from "../services/cart.service";


export interface ICartRepository {
    findById(cartId: string): Promise<ICart | null>
    findAllForUser(userId: string): Promise<ICart[]>
    create(userId: string, item: CartItem): Promise<ICart>
    clear(userId: string): Promise<void>;
    update(userId: string, data: Partial<ICart>): Promise<ICart | null>
    delete(userId: string, cartId: string): Promise<ICart | null>
}

export class PostgresCartRepository implements ICartRepository {

    constructor(
        private cartModel: typeof ShoppingCart = ShoppingCart
    ) { }

    findById(cartId: string): Promise<ICart | null> {
        return this.cartModel.findByPk(cartId);
    }

    findAllForUser(userId: string): Promise<ICart[]> {
        return this.cartModel.findAll({
            where: { userId }
        })
    }

    create(userId: string, item: CartItem): Promise<ICart> {
        return this.cartModel.create({
            userId,
            ...item
        })
    }

    async update(userId: string, data: Partial<ICart>): Promise<ICart | null> {
        const found = await this.cartModel.findOne({
            where: { userId }
        });
        if (!found) return null;
        const updated = await found.update(data)
        return updated;
    }

    async clear(userId: string) {
        return void this.cartModel.destroy({
            where: { userId }
        });
    }

    async delete(userId: string, cartId: string): Promise<ICart | null> {
        const found = await this.cartModel.findOne({
            where: { userId, cartId }
        });
        if (!found) return null;
        await found.destroy()
        return found;
    }

}

export const cartRepository = new PostgresCartRepository();