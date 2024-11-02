import { AxiosError } from "axios";
import axiosInstance from "../actionAxios";
import { IPurchase } from "../slices/purchaseSlice"

export const getPurchases = async (): Promise<IPurchase[]> => {
    try {
        const response = await axiosInstance.get('/purchases');
        console.log('Purchases:', response.data.purchases);
        
        return response.data.purchases;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status == 404) {
                return [];
            }
        }
        console.error('Error fetching purchases:', error);
        throw error;
    }
}
export const makePurchase = async (details: IPurchase): Promise<IPurchase> => {
    try {
        const response = await axiosInstance.post('/purchases/', details);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw error.response.data
            }
        }
        console.error('Error creating purchase:', error);
        throw error;
    }
}