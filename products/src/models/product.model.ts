import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

export const ProductModel = mongoose.model<IProduct>('Product', new Schema({
    name: String,
    description: String,
    price: String,
    brand: String,
    stock: Number,
    tags: [String],
}, {
    id: true,
    autoCreate: true,
}))