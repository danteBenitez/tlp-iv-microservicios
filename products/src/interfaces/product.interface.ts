export interface IProductImage {
    path: string,
    type: string,
    productId: string
}
export interface IProduct {
    id: string,
    name: string,
    price: number,
    brand: string,
    images: IProductImage[],
    tags: string[],
    description: string,
    stock: number,
    providerId?: number
}
