import { AxiosError } from "axios";
import axiosInstance from "../actionAxios";

export const getShoppingCart = async () => {
    try {
        const response = await axiosInstance.get(`/shopping-carts`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw error.response.data
            }
        }
        console.error('Error getting cart:', error);
        throw error;
    }
}

export type CartItem = {
    cartId?: string;
    productId: string,
    quantity: number,
    delete?: boolean
}

export const updateShoppingCart = async (data: CartItem[]) => {
    try {
        const response = await axiosInstance.post(`/shopping-carts/`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw error.response.data
            }
        }
        console.error('Error updating product:', error);
        throw error;
    }
}

export const buyShoppingCart = async (address: string) => {
    try {
        const response = await axiosInstance.post(`/shopping-carts/buy/`, { address });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw error.response.data
            }
        }
        console.error('Error updating product:', error);
        throw error;
    }
}