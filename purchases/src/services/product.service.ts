import { config } from "../config/config.service";
import { IProduct } from "../interfaces/product.interface";
import { UsersService, usersService as usersService_ } from "./user.service";

export class ProductService {
    constructor(
        private serviceUrl = config.getProductServiceUrl(),
        private usersService: UsersService = usersService_
    ) { }

    private async requestWithAuth(url: string, options?: RequestInit): Promise<Response> {
        const fullUrl = new URL(url, this.serviceUrl);
        let token = this.usersService.token;
        if (!token) {
            token = await this.usersService.getToken();
        }
        console.log({ token });
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                ...options?.headers ?? {},
                Authorization: `Bearer ${token}`,
            },
        });

        return response;
    }

    async findById(productId: string): Promise<IProduct | null> {
        const response = await this.requestWithAuth(`/api/products/${productId}`);
        if (response.status == 404 || response.status == 400) {
            return null;
        }
        return (await response.json()) as IProduct;
    }

    async update(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        const response = await this.requestWithAuth(`/api/products/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });
        if (response.status == 404 || response.status == 401) {
            console.warn("Respuesta al actualizar: ", await response.text());
            return null;
        }
        return (await response.json()) as IProduct;
    }
}

export const productService = new ProductService();