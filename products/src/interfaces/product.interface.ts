export interface IProduct {
    id: string,
    name: string,
    price: number,
    brand: string,
    tags: string[],
    description: string,
    stock: number,
    providerId?: number
}
