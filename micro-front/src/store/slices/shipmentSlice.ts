import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getShipments } from "../services/shipmentService";
import { AppThunk } from "../store";
import { showNotification } from "./notificationSlice";
import { IProduct } from "./productSlice";


export const SHIPMENT_STATUS = {
    IN_STOCK: "stock",
    DELIVERED: "delivered",
    TRAVELING: "traveling"
} as const;

export type ShipmentStatus = typeof SHIPMENT_STATUS[keyof typeof SHIPMENT_STATUS];

export const SHIPMENT_STATUS_LIST = [SHIPMENT_STATUS.IN_STOCK, SHIPMENT_STATUS.DELIVERED, SHIPMENT_STATUS.TRAVELING];

export interface IShipment {
    shipmentId: string,
    address: string,
    status: ShipmentStatus,
    userId: string,
    saleId: string
}

export interface ISaleDetail {
    saleDetailId?: string,
    quantity: number,
    sellPrice?: number,
    saleId?: string,
    productId: string,
    product?: IProduct
}

export interface ShipmentState {
    shipments: IShipment[];
    loading: boolean;
    error: string | null;
}

const initialState: ShipmentState = {
    shipments: [],
    loading: false,
    error: null,
};

const shipmentSlice = createSlice({
    name: "shipments",
    initialState,
    reducers: {
        fetchShipmentsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchShipmentSuccess(state, action: PayloadAction<IShipment[]>) {
            state.shipments = action.payload;
            state.loading = false;
        },
        fetchShipmentFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchShipmentsStart,
    fetchShipmentFailure,
    fetchShipmentSuccess
} = shipmentSlice.actions;

export const fetchShipments = (): AppThunk => async (dispatch) => {
    try {
        dispatch(fetchShipmentsStart());
        const ships = await getShipments();
        dispatch(fetchShipmentSuccess(ships));
    } catch (error) {
        if (error instanceof Error) {
            dispatch(fetchShipmentFailure(error.message));
            dispatch(showNotification({ message: error.message, type: "error" }));
        } else {
            dispatch(fetchShipmentFailure("An error occurred"));
            dispatch(
                showNotification({ message: "An error occurred", type: "error" })
            );
        }
    }
};


export default shipmentSlice.reducer;
