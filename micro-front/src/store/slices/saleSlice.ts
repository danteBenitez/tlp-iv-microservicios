import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSales, getSalesForUser, makeSell } from "../services/saleService";
import { AppThunk } from "../store";
import { showNotification } from "./notificationSlice";
import { IProduct } from "./productSlice";



export interface ISale {
    saleId: string,
    dateSale: Date,
    userId: string
    details: ISaleDetail[]
}

export interface ISaleDetail {
    saleDetailId?: string,
    quantity: number,
    sellPrice?: number,
    saleId?: string,
    productId: string,
    product?: IProduct
}

export interface SaleState {
    sales: ISale[];
    loading: boolean;
    error: string | null;
}

const initialState: SaleState = {
    sales: [],
    loading: false,
    error: null,
};

const saleSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {
        fetchSalesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchSalesSuccess(state, action: PayloadAction<ISale[]>) {
            state.sales = action.payload;
            state.loading = false;
        },
        fetchSalesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        createSale(state, action: PayloadAction<ISale>) {
            state.sales.push(action.payload);
        },
    },
});

export const {
    createSale,
    fetchSalesFailure,
    fetchSalesStart,
    fetchSalesSuccess,
} = saleSlice.actions;

export const fetchSales = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchSalesStart());
        const sales = await getSales();
        dispatch(fetchSalesSuccess(sales));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchSalesFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchSalesFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
    }
};

export const fetchSalesForUser = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchSalesStart());
        const sales = await getSalesForUser();
        dispatch(fetchSalesSuccess(sales));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchSalesFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchSalesFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
    }
};

export const addSale = (details: { address: string, items: ISaleDetail[] }): AppThunk<Promise<ISale | null>> => async (dispatch) => {
    try {
        const sale = await makeSell(details);
        dispatch(createSale(sale));
        dispatch(showNotification({ message: "Compra realizada con éxito", type: "success" }));
        return sale;
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchSalesFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchSalesFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
        return null;
    }
};



export default saleSlice.reducer;
