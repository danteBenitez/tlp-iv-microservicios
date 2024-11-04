import { AxiosError } from 'axios';
import axiosInstance from '../actionAxios';
import { ISaleDetail } from '../slices/saleSlice';

export const getSales = async () => {
    try {
        const response = await axiosInstance.get('/sales/');
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

export const getSalesForUser = async () => {
    try {
        const response = await axiosInstance.get('/sales/mine');
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

export const getSaleById = async (saleId: string) => {
    try {
        const response = await axiosInstance.get(`/sales/${saleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sale by ID:', error);
        throw error;
    }
};

export const makeSell = async (sale: { address: string, items: ISaleDetail[] }) => {
    try {
        const response = await axiosInstance.post('/sales/', sale);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data) {
                throw error.response.data
            }
        }
        console.error('Error creating sale:', error);
        throw error;
    }
};
