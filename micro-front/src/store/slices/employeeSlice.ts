import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export interface IEmployee {
    _id: string;
    name: string;
    lastName: string;
    dni: string;
    email: string;
    phone: string;
    address: string;
    city: string;
}

export interface EmployeesState {
    employees: IEmployee[];
    loading: boolean;
    error: string | null;
}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
};

export const fetchEmployeesByNameOrDni = createAsyncThunk('employees/fetchEmployeesByNameOrDni', async (searchTerm: string, { getState }) => {
    const state = getState() as { auth: { token: string } };
    const response = await axiosInstance.get(`/employees/search?namesOrDnis=${searchTerm}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
});

export const fetchEmployee = createAsyncThunk('employees/fetchEmployee', async (id: string, { getState }) => {
    const state = getState() as { auth: { token: string } };
    const response = await axiosInstance.get(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${state.auth.token}` },
    });
    return response.data;
});

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async () => {
    const response = await axiosInstance.get('/api/employees');
    return response.data;
});

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeesByNameOrDni.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployeesByNameOrDni.fulfilled, (state, action: PayloadAction<IEmployee[]>) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchEmployeesByNameOrDni.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
            .addCase(fetchEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEmployee.fulfilled, (state, action: PayloadAction<IEmployee>) => {
                state.loading = false;
                state.employees = [action.payload];
            })
            .addCase(fetchEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            })
    },
});

export default employeeSlice.reducer;
