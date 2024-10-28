import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './userSlice';
import { Dispatch } from 'redux';
import axiosInstance from '../actionAxios';

export interface AuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: IUser; token: string}>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      console.log('Removing user from localStorage');
      console.log('Removing token from localStorage');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    registerSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      console.log('Saving user to localStorage:', action.payload.user);
      console.log('Saving token to localStorage:', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
  },
});

export const { login, logout, registerSuccess } = authSlice.actions;

export const register = (formData: any) => async (dispatch: Dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/register', formData);
    dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
    return response.data;
  } catch (error) {
    console.error('Error al registrar usuario', error);
    throw error;
  }
}

export default authSlice.reducer;