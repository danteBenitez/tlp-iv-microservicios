import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import axiosInstance, { setAuthToken } from "../actionAxios";
import { ReactNode } from "react";
import { showNotification } from "./notificationSlice";

export interface IUser {
    createdAt?: ReactNode;
    _id?: string;
    name: string;
    lastName?: string;
    username: string;
    cuil?: string;
    password: string;
    email: string;
    dni: string;
    phone: string;
    address: string;
    city: string;
    rol: string;
}

export interface UsersState {
    users: IUser[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
};

export const fetchEmployeesByNameOrDni = createAsyncThunk(
    'users/fetchEmployeesByNameOrDni',
    async (searchTerm: string, { getState }) => {
        const state = getState() as { auth: { token: string } };
        try {
            const response = await axiosInstance.get(`/users/search?namesOrDnis=${searchTerm}`, {
                headers: { Authorization: `Bearer ${state.auth.token}` },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    })

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess(state, action: PayloadAction<IUser[]>) {
            state.users = action.payload;
            state.loading = false;
        },
        fetchUsersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } = usersSlice.actions;

export const fetchUsers = (): AppThunk => async (dispatch, getState) => {
    dispatch(fetchUsersStart());
    try {
        const token = getState().auth.token;
        setAuthToken(token);
        const response = await axiosInstance.get('/users');
        dispatch(fetchUsersSuccess(response.data));
    } catch (error: any) {
        dispatch(fetchUsersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
    }
}

export default usersSlice.reducer;