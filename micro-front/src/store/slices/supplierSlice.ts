import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { showNotification } from "./notificationSlice";
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "../services/suppliersService";

export interface ISupplier {
  supplierId: string;
  companyName: string;
  cuit: string;
  phoneNumber: string;
  address: string;
  email: string;
}

export interface SuppliersState {
  suppliers: ISupplier[];
  loading: boolean;
  error: string | null;
}

const initialState: SuppliersState = {
  suppliers: [],
  loading: false,
  error: null,
};

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    fetchSuppliersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSuppliersSuccess(state, action: PayloadAction<ISupplier[]>) {
      state.suppliers = action.payload;
      state.loading = false;
    },
    fetchSuppliersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createSupplierSuccess(state, action: PayloadAction<ISupplier>) {
      state.suppliers.push(action.payload);
    },
    updateSupplierSuccess(state, action: PayloadAction<ISupplier>) {
      const index = state.suppliers.findIndex(
        (supplier) => supplier.supplierId === action.payload.supplierId
      );
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplierSuccess(state, action: PayloadAction<string>) {
      state.suppliers = state.suppliers.filter(
        (supplier) => supplier.supplierId !== action.payload
      );
    },
  },
});

export const {
  fetchSuppliersStart,
  fetchSuppliersSuccess,
  fetchSuppliersFailure,
  createSupplierSuccess,
  updateSupplierSuccess,
  deleteSupplierSuccess,
} = suppliersSlice.actions;

export const fetchAllSuppliers = (): AppThunk => async (dispatch) => {
  try {
    dispatch(fetchSuppliersStart());
    const suppliers = await getSuppliers();
    dispatch(fetchSuppliersSuccess(suppliers));
  } catch (error) {
    if (error instanceof Error) {
      dispatch(fetchSuppliersFailure(error.message));
      dispatch(showNotification({ message: error.message, type: "error" }));
    } else {
      dispatch(fetchSuppliersFailure("An error occurred"));
      dispatch(
        showNotification({ message: "An error occurred", type: "error" })
      );
    }
  }
};

export const fetchSupplier =
  (supplierId: string): AppThunk =>
  async (dispatch) => {
    try {
      const supplier = await getSupplierById(supplierId);
      dispatch(updateSupplierSuccess(supplier));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchSuppliersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: "error" }));
      } else {
        dispatch(fetchSuppliersFailure("An error occurred"));
        dispatch(
          showNotification({ message: "An error occurred", type: "error" })
        );
      }
    }
  };

export const addSupplier =
  (supplierData: Omit<ISupplier, 'supplierId'>): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    try {      
      const supplier = await createSupplier(supplierData);
      
      dispatch(createSupplierSuccess(supplier));
      dispatch(
        showNotification({
          message: "Supplier created successfully",
          type: "success",
        })
      );
      return true;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchSuppliersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: "error" }));
      } else {
        dispatch(fetchSuppliersFailure("An error occurred"));
        dispatch(
          showNotification({ message: "An error occurred", type: "error" })
        );
      }
      return false;
    }
  };

export const editSupplier =
  (supplierId: string, supplierData: Omit<ISupplier, 'supplierId'>): AppThunk<Promise<boolean>> =>
  async (dispatch) => {
    try {
      const supplier = await updateSupplier(supplierId, supplierData);
      dispatch(updateSupplierSuccess(supplier));
      dispatch(
        showNotification({
          message: "Supplier updated successfully",
          type: "success",
        })
      );
      return true;
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchSuppliersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: "error" }));
      } else {
        dispatch(fetchSuppliersFailure("An error occurred"));
        dispatch(
          showNotification({ message: "An error occurred", type: "error" })
        );
      }
      return false;
    }
  };

export const removeSupplier =
  (supplierId: string): AppThunk =>
  async (dispatch) => {
    try {
      await deleteSupplier(supplierId);
      dispatch(deleteSupplierSuccess(supplierId));
      dispatch(
        showNotification({
          message: "Supplier deleted successfully",
          type: "success",
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(fetchSuppliersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: "error" }));
      } else {
        dispatch(fetchSuppliersFailure("An error occurred"));
        dispatch(
          showNotification({ message: "An error occurred", type: "error" })
        );
      }
    }
  };

export default suppliersSlice.reducer;
