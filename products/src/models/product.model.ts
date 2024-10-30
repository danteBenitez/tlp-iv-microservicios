import mongoose, { Schema } from "mongoose";
import { IProduct, IProductImage } from "../interfaces/product.interface";

export const ImageSchema = new Schema({
    type: String,
    path: String,
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
}, {
    id: true,
    autoCreate: true
});

export const Image = mongoose.model<IProductImage>('Image', ImageSchema);

export const ProductModel = mongoose.model<IProduct>('Product', new Schema({
    name: String,
    description: String,
    price: String,
    brand: String,
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    stock: Number,
    tags: [String],
}, {
    id: true,
    autoCreate: true,
}))