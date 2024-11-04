import { AxiosError } from 'axios';
import axiosInstance from '../actionAxios';

export const getShipments = async () => {
    try {
        const response = await axiosInstance.get('/shipments/');
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status == 404) {
                return [];
            }
        }
        console.error('Error fetching sales:', error);
        throw error;
    }
};