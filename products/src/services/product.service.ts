import { IProduct } from "../interfaces/product.interface";
import { FindProductOptions, IProductRepository, productRepository } from "../repositories/product.repository";

export class ProductNotFoundError extends Error { }
export class ExistingProductError extends Error { }

export class ProductService {
    constructor(
        private productRepository: IProductRepository
    ) { }

    async findAll(options: FindProductOptions): Promise<IProduct[]> {
        return this.productRepository.findAll(options);
    }

    async findById(productId: string): Promise<IProduct> {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new ProductNotFoundError("Producto no encontrado");
        }
        return product;
    }

    async create(product: Omit<IProduct, "id">): Promise<IProduct> {
        // TODO: Chequear que existe el proveedor
        const existing = await this.productRepository.findAll({
            filter: {
                name: product.name
            }
        });

        if (existing.length != 0) {
            throw new ExistingProductError("Existe un producto con el mismo nombre");
        }

        const created = await this.productRepository.create(product);

        if (!created) {
            throw new Error("No fue posible crear el producto");
        }

        return created;
    }

    async update(productId: string, product: Partial<IProduct>) {
        // TODO: Chequear que existe el proveedor
        if (product.name) {
            const existing = await this.productRepository.findExcluding(product.name, productId);

            if (existing) {
                throw new ExistingProductError("Un producto con ese nombre ya existe");
            }
        }

        const updated = await this.productRepository.update(productId, product);

        if (!updated) {
            throw new ProductNotFoundError("Producto no encontrado");
        }

        return updated;
    }

    async delete(productId: string) {
        const deleted = await this.productRepository.delete(productId);
        if (!deleted) {
            throw new ProductNotFoundError("Producto no encontrado");
        }
        return deleted;
    }
}

export const productService = new ProductService(productRepository);