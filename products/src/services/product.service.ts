import { IProduct, IProductImage } from "../interfaces/product.interface";
import { FindProductOptions, IProductRepository, productRepository } from "../repositories/product.repository";
import { fileService, FilesService } from "./file.service";

export class ProductNotFoundError extends Error { }
export class ExistingProductError extends Error { }
export class ImageNotFoundError extends Error { }

export type ProductWithDeletedImages = Omit<IProduct, "images"> & {
    images: string[]
}

export class ProductService {
    constructor(
        private productRepository: IProductRepository,
        private fileService: FilesService
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

    async getImageForProduct(imageId: string) {
        const productImage = await this.productRepository.findProductImage(imageId);
        if (!productImage) {
            throw new ImageNotFoundError("Imagen no encontrada");
        }
        return productImage;
    }

    async create(product: Omit<IProduct, "id" | "images">, files: Express.Multer.File[]): Promise<IProduct> {
        const existing = await this.productRepository.findAll({
            filter: {
                name: product.name
            }
        });

        if (existing.length != 0) {
            throw new ExistingProductError("Existe un producto con el mismo nombre");
        }

        let images: Omit<IProductImage, "productId">[] = [];
        if (files && files.length !== 0) {
            for (const file of files) {
                const { originalFilename } = await this.fileService.uploadFile(file);
                images.push({
                    path: originalFilename,
                    type: file.mimetype,
                });
            }
        }

        const created = await this.productRepository.create({
            ...product,
            images
        });

        if (!created) {
            throw new Error("No fue posible crear el producto");
        }

        return created;
    }

    async update(productId: string, product: Partial<ProductWithDeletedImages>, files: Express.Multer.File[]) {
        if (product.name) {
            const existing = await this.productRepository.findExcluding(product.name, productId);

            if (existing) {
                throw new ExistingProductError("Un producto con ese nombre ya existe");
            }
        }

        const found = await this.productRepository.findById(productId);

        if (!found) {
            throw new ProductNotFoundError("Producto no encontrado");
        }

        if (product.images && product.images.length !== 0) {
            await this.productRepository.deleteImagesFor(productId, product.images ?? []);
        }

        let images: IProductImage[] = [];

        if (files && files.length !== 0) {
            for (const file of files) {
                console.log({ file });
                const { originalFilename } = await this.fileService.uploadFile(file);
                images.push({
                    path: originalFilename,
                    type: file.mimetype,
                    productId: found.id
                });
            }
        }
        console.log({ images });

        const updated = await this.productRepository.update(productId, {
            ...product,
            images
        });

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

export const productService = new ProductService(productRepository, fileService);