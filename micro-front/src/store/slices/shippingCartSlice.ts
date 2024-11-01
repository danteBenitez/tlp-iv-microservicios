import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { buyShoppingCart, CartItem, getShoppingCart, updateShoppingCart } from "../services/shoppingCartService";
import { AppThunk } from "../store";
import { showNotification } from "./notificationSlice";
import { IProduct } from "./productSlice";


export interface ICart {
    cartId: string,
    quantity: number,
    productId: string,
    product: IProduct,
    userId: string
}

export interface CartState {
    cart: ICart[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: [],
    loading: false,
    error: null,
};

const suppliersSlice = createSlice({
    name: "carts",
    initialState,
    reducers: {
        fetchShoppingCartsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchShoppingCartsSuccess(state, action: PayloadAction<ICart[]>) {
            state.cart = action.payload;
            state.loading = false;
        },
        fetchShoppingCartsFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        createShoppingCartSuccess(state, action: PayloadAction<ICart>) {
            state.cart.push(action.payload);
        },
        updateShoppingCartSuccess(state, action: PayloadAction<ICart>) {
            const index = state.cart.findIndex(
                (supplier) => supplier.cartId === action.payload.cartId
            );
            if (index !== -1) {
                state.cart[index] = action.payload;
            }
        },
        deleteShoppingCartSuccess(state, action: PayloadAction<string>) {
            state.cart = state.cart.filter(
                (supplier) => supplier.cartId !== action.payload
            );
        },
    },
});

export const {
    fetchShoppingCartsFailure,
    fetchShoppingCartsStart,
    fetchShoppingCartsSuccess,
    createShoppingCartSuccess,
    deleteShoppingCartSuccess,
    updateShoppingCartSuccess
} = suppliersSlice.actions;

export const fetchShoppingCart = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchShoppingCartsStart());
        const cart = await getShoppingCart();
        dispatch(fetchShoppingCartsSuccess(cart));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchShoppingCartsFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchShoppingCartsFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
    }
};

export const editShoppingCart =
    (cartItems: CartItem[]): AppThunk =>
        async (dispatch) => {
            try {
                const supplier = await updateShoppingCart(cartItems);
                dispatch(updateShoppingCartSuccess(supplier));
                dispatch(
                    showNotification({
                        message: "ShoppingCart updated successfully",
                        type: "success",
                    })
                );
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(fetchShoppingCartsFailure(error.message));
                    dispatch(showNotification({ message: error.message, type: "error" }));
                } else {
                    dispatch(fetchShoppingCartsFailure("An error occurred"));
                    dispatch(
                        showNotification({ message: "An error occurred", type: "error" })
                    );
                }
            }
        };

export const buyAllFromShoppingCart =
    (address: string): AppThunk =>
        async (dispatch) => {
            try {
                await buyShoppingCart(address);
                dispatch(
                    showNotification({
                        message: "Compra realizada con éxito",
                        type: "success",
                    })
                );
                dispatch(fetchShoppingCart());
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(fetchShoppingCartsFailure(error.message));
                    dispatch(showNotification({ message: error.message, type: "error" }));
                } else {
                    dispatch(fetchShoppingCartsFailure("An error occurred"));
                    dispatch(
                        showNotification({ message: "An error occurred", type: "error" })
                    );
                }
            }
        };

export default suppliersSlice.reducer;
