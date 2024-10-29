import { Model, SortOrder } from "mongoose";
import { IProduct } from "../interfaces/product.interface";
import { ProductModel } from "../models/product.model";

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
    create(product: Omit<IProduct, "id">): Promise<IProduct | null>;
    update(productId: string, product: Partial<IProduct>): Promise<IProduct | null>;
    delete(productId: string): Promise<IProduct | null>;
}

export class MongoProductRepository implements IProductRepository {

    constructor(
        private productModel: Model<IProduct> = ProductModel
    ) { }

    async findById(productId: string): Promise<IProduct | null> {
        const created = await this.productModel.findById(productId);
        return created;
    }

    async findAll(options: FindProductOptions): Promise<IProduct[]> {
        const query = this.productModel.find();

        if (options.filter) {
            query.where(options.filter);
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

    async create(product: Omit<IProduct, "id">): Promise<IProduct | null> {
        const created = await this.productModel.create(product);
        return created;
    }

    async update(productId: string, product: Partial<IProduct>): Promise<IProduct | null> {
        const found = await this.productModel.findById(productId);
        if (!found) return null;
        const updated = await this.productModel.findOneAndUpdate({
            _id: found.id,
        }, product, { new: true });
        return updated;
    }

    async delete(productId: string): Promise<IProduct | null> {
        const found = await this.productModel.findById(productId);

        if (!found) {
            return null;
        }
        await found.deleteOne();

        return found;
    }
}

export const productRepository = new MongoProductRepository();