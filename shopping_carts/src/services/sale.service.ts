import { config } from "../config/config.service";
import { IProduct } from "../interfaces/product.interface";
import { CartItem } from "./cart.service";

export class SaleService {


    async sell(userId: string, cartItems: CartItem[]): Promise<IProduct | null> {
        const fullUrl = new URL(config.getSaleServiceUrl());
        const response = await fetch(fullUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Authentication-Id": userId
            },
            body: JSON.stringify(cartItems)
        });
        if (response.status == 404 || response.status == 401) {
            console.warn("Respuesta al intentar vender: ", await response.text());
            return null;
        }
        return (await response.json());
    }
}

export const saleService = new SaleService();