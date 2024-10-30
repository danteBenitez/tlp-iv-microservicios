import { config } from "../config/config.service";
import { IProduct } from "../interfaces/product.interface";
import { ISupplier } from "../interfaces/supplier.interface";
import { UsersService, usersService as usersService_ } from "./user.service";

export class SupplierService {
    constructor(
        private serviceUrl = config.getSupplierServiceUrl(),
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

    async findById(supplierId: string): Promise<ISupplier | null> {
        const response = await this.requestWithAuth(`/api/suppliers/${supplierId}`);
        if (response.status == 404) {
            return null;
        }
        return (await response.json()) as ISupplier;
    }
}

export const supplierService = new SupplierService();