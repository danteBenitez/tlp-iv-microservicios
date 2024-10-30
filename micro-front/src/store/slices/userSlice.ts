import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import axiosInstance, { setAuthToken } from "../actionAxios";
import { showNotification } from "./notificationSlice";

export interface IUser {
    roles: any;
    userId: string;
    username: string;
    password: string;
    email: string;
    createdAt: string;
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
        const response = await axiosInstance.get('/auth/users');
        dispatch(fetchUsersSuccess(response.data.users));
    } catch (error: any) {
        dispatch(fetchUsersFailure(error.message));
        dispatch(showNotification({ message: error.message, type: 'error' }));
    }
}

export default usersSlice.reducer;