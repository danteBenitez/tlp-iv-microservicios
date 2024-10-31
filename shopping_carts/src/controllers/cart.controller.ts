import { Request, Response } from "express";
import { CartNotFoundError, CartService, cartService as cartService_, CouldNotBuyError, ProductNotFoundError } from "../services/cart.service";
import { validateRequestBody } from "../utils/validate-schema";
import { cartItemsSchema } from "../validations/cart.schema";

export class CartController {

    constructor(private cartService: CartService = cartService_) { }

    async findForUser(req: Request, res: Response) {
        if (!req.user) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }

        try {
            const found = await this.cartService.findAllForUser(req.user.userId.toString());

            return res.status(200).json(found);

        } catch (err) {
            if (err instanceof CartNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async addToCartOf(req: Request, res: Response) {
        const { data } = await validateRequestBody(req, cartItemsSchema);
        if (!req.user) {
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }

        try {
            const carts = await this.cartService.addToCartOf(req.user.userId.toString(), data)

            return res.status(200).json(carts);

        } catch (err) {
            if (err instanceof CartNotFoundError || err instanceof ProductNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async buyAllCart(req: Request, res: Response) {
        const bearerToken = req.headers.authorization;
        if (!req.user || !bearerToken) {
            console.warn("No se encontró token en la petición");
            return res.status(401).json({
                message: "No estás autenticado"
            });
        }

        try {
            const carts = await this.cartService.buyAllCart(req.user.userId.toString());

            return res.status(200).json(carts);

        } catch (err) {
            if (err instanceof CouldNotBuyError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }
}