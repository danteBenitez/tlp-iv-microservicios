import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createProduct, deleteProduct, fetchProductById, fetchProducts, updateProduct } from '../services/productService';
import { AppThunk } from '../store';
import { showNotification } from './notificationSlice';

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: string;
    brand: string;
    images: { _id: string }[];
    tags: string[];
    stock: number;
}

export interface ProductsState {
    products: IProduct[];
    loading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    loading: false,
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        fetchProductsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action: PayloadAction<IProduct[]>) {
            state.products = action.payload;
            state.loading = false;
        },
        fetchProductsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        createProductSuccess(state, action: PayloadAction<IProduct>) {
            state.products.push(action.payload);
        },
        updateProductSuccess(state, action: PayloadAction<IProduct>) {
            const index = state.products.findIndex(product => product._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProductSuccess(state, action: PayloadAction<string>) {
            state.products = state.products.filter(product => product._id !== action.payload);
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    createProductSuccess,
    updateProductSuccess,
    deleteProductSuccess,
} = productsSlice.actions;

export const fetchAllProducts = (): AppThunk => async dispatch => {
    try {
        dispatch(fetchProductsStart());
        const products = await fetchProducts();
        dispatch(fetchProductsSuccess(products));
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
    }
};

export const fetchProduct = (productId: string): AppThunk => async dispatch => {
    try {
        const product = await fetchProductById(productId);
        dispatch(updateProductSuccess(product));
        return true;
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
    }
};

export const addProduct = (productData: FormData): AppThunk<Promise<boolean>> => async dispatch => {
    try {
        const product = await createProduct(productData);
        dispatch(createProductSuccess(product));
        dispatch(showNotification({ message: 'Product created successfully', type: 'success' }));
        return true;
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
        return false;
    }
};

export const editProduct = (productId: string, productData: FormData): AppThunk<Promise<boolean>> => async dispatch => {
    try {
        const product = await updateProduct(productId, productData);
        dispatch(updateProductSuccess(product));
        dispatch(showNotification({ message: 'Product updated successfully', type: 'success' }));
        return true;
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
        return false;
    }
};

export const removeProduct = (productId: string): AppThunk<Promise<boolean>> => async dispatch => {
    try {
        await deleteProduct(productId);
        dispatch(deleteProductSuccess(productId));
        dispatch(showNotification({ message: 'Product deleted successfully', type: 'success' }));
        return true;
    } catch (error: any) {
        dispatch(fetchProductsFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
        return false;
    }
};

export default productsSlice.reducer;