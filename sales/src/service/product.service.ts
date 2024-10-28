import { config } from "../config/config.service";
import { IProduct } from "../interfaces/product.interface";

export class ProductService {
    private token: string | null = null

    constructor(
        private serviceUrl = config.getProductServiceUrl(),
    ) { }

    private async requestWithAuth(url: string, options?: RequestInit): Promise<Response> {
        const fullUrl = new URL(url, this.serviceUrl);
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                ...options?.headers ?? {},
                Authorization: `Bearer ${this.token}`,
            },
        });

        return response;
    }

    async findById(productId: string): Promise<IProduct | null> {
        const response = await this.requestWithAuth(`/${productId}`);
        if (response.status == 404) {
            return null;
        }
        return (await response.json()) as IProduct;
    }

    async update(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        const response = await this.requestWithAuth(`/${productId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });
        if (response.status == 404) {
            return null;
        }
        return (await response.json()) as IProduct;
    }
}

export const productService = new ProductService();