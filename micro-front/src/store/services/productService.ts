import axiosInstance from '../actionAxios';

export const fetchProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (productId: string) => {
    try {
        const response = await axiosInstance.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

export const createProduct = async (productData: FormData) => {
    try {
        const response = await axiosInstance.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (productId: string, productData: FormData) => {
    try {
        const response = await axiosInstance.patch(`/products/${productId}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (productId: string) => {
    try {
        const response = await axiosInstance.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};