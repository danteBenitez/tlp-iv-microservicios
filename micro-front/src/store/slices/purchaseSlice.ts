import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { showNotification } from "./notificationSlice";
import { IProduct } from "./productSlice";
import { getPurchases, makePurchase } from "../services/purchaseService";
import { ISupplier } from "./supplierSlice";


export interface IPurchase {
    purchaseId?: string,
    datePurchase: Date,
    supplierId: string
    supplier?: ISupplier
    details: IPurchaseDetail[]
}

export interface IPurchaseDetail {
    purchaseDetailId?: string,
    quantity: number,
    costPrice: number,
    purchaseId?: string,
    productId: string
    product?: IProduct
}

export interface PurchaseState {
    purchases: IPurchase[];
    loading: boolean;
    error: string | null;
}

const initialState: PurchaseState = {
    purchases: [],
    loading: false,
    error: null,
};

const purchaseSlice = createSlice({
    name: "purchases",
    initialState,
    reducers: {
        fetchPurchasesStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchPurchasesSuccess(state, action: PayloadAction<IPurchase[]>) {
            state.purchases = action.payload;
            state.loading = false;
        },
        fetchPurchasesFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        createPurchase(state, action: PayloadAction<IPurchase>) {
            state.purchases.push(action.payload);
        },
    },
});

export const {
    createPurchase,
    fetchPurchasesFailure,
    fetchPurchasesStart,
    fetchPurchasesSuccess,
} = purchaseSlice.actions;

export const fetchPurchases = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchPurchasesStart());
        const purchases = await getPurchases();
        dispatch(fetchPurchasesSuccess(purchases));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchPurchasesFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchPurchasesFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
    }
};

export const addPurchase = (purchases: IPurchase): AppThunk<Promise<IPurchase | null>> => async (dispatch) => {
    try {
        const purchase = await makePurchase(purchases);
        dispatch(createPurchase(purchase));
        dispatch(showNotification({ message: "Compra realizada con éxito", type: "success" }));
        return purchase;
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchPurchasesFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchPurchasesFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
        return null;
    }
};



export default purchaseSlice.reducer;