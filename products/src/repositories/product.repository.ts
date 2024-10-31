import { Model, SortOrder } from "mongoose";
import { IProduct, IProductImage } from "../interfaces/product.interface";
import { Image, ProductModel } from "../models/product.model";

type PaginateQuery = { page: number, perPage: number };

export type FindProductOptions = {
    filter?: Partial<IProduct>,
    order?: {
        field: keyof IProduct,
        direction: SortOrder
    },
} & Partial<PaginateQuery>;

export interface IProductRepository {
    findById(productId: string): Promise<IProduct | null>;
    /** Encuentra un producto por nombre, excluyendo un producto con productId */
    findExcluding(productName: string, productId: string): Promise<IProduct | null>
    findAll(options: FindProductOptions): Promise<IProduct[]>;
    findProductImage(imageId: string): Promise<IProductImage | null>
    create(product: ProductCreationAttributes): Promise<IProduct | null>;
    update(productId: string, product: Partial<IProduct>): Promise<IProduct | null>;
    delete(productId: string): Promise<IProduct | null>;
    deleteImagesFor(productId: string, imagesIds: string[]): Promise<IProduct | null>
}

type ProductCreationAttributes = Omit<IProduct, "images" | "id"> & {
    images: Omit<IProductImage, "productId">[]
}

export class MongoProductRepository implements IProductRepository {

    constructor(
        private productModel: Model<IProduct> = ProductModel,
        private imageModel: Model<IProductImage> = Image
    ) { }

    async findById(productId: string): Promise<IProduct | null> {
        const created = await this.productModel.findById(productId).populate('images');
        return created;
    }

    findProductImage(imageId: string): Promise<IProductImage | null> {
        return this.imageModel.findById(imageId);
    }

    async findAll(options: FindProductOptions): Promise<IProduct[]> {
        const query = this.productModel.find().populate('images');

        if (options.filter) {
            const withWildcard: Record<string, unknown> = {}
            for (const filter in options.filter) {
                const value = options.filter[filter as keyof typeof options.filter];
                if (typeof value === "string") {
                    withWildcard[filter as keyof IProduct] = new RegExp(`^${value}`);
                }
            }
            query.where(withWildcard);
        }

        if (options.order) {
            query.sort({
                [options.order.field]: options.order.direction
            });
        }

        if (options.page && options.perPage) {
            query.skip((options.page - 1) * options.perPage);
            query.limit(options.perPage);
        }

        return query.exec();
    }

    async findExcluding(productName: string, productId: string): Promise<IProduct | null> {
        const query = this.productModel.findOne({
            _id: {
                $not: { $eq: productId }
            },
            name: productName
        });
        const result = await query.exec();
        return result;
    }

    async create(product: ProductCreationAttributes): Promise<IProduct | null> {
        const { images, ...rest } = product;
        const created = await this.productModel.create(rest);
        const resultImages = await this.imageModel.insertMany(images.map(i => ({
            ...i,
            productId: created._id
        })));
        await created.updateOne({ images: resultImages.map(i => i._id) });
        return created;
    }

    async update(productId: string, product: Partial<IProduct>): Promise<IProduct | null> {
        const found = await this.productModel.findById(productId);
        let { images, ...rest } = product;
        if (!found) return null;
        const updated = await this.productModel.findOneAndUpdate({
            _id: found._id,
        }, rest, { new: true });
        if (product.images) {
            const withIds = await this.imageModel.insertMany(product.images.map(i => ({
                ...i,
                productId: productId
            })));
            await updated?.updateOne({ images: [...found.images, ...withIds.map(i => i._id)] })
        }
        return this.findById(productId);
    }

    async delete(productId: string): Promise<IProduct | null> {
        const found = await this.productModel.findById(productId);

        if (!found) {
            return null;
        }
        await found.deleteOne();

        return found;
    }

    async deleteImagesFor(productId: string, imageIds: string[]): Promise<IProduct | null> {
        const updated = await this.imageModel.deleteMany({
            _id: { $in: imageIds },
            productId
        });
        return this.findById(productId);
    }
}

export const productRepository = new MongoProductRepository();