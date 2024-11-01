import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Dispatch } from 'redux';
import axiosInstance, { setAuthToken } from '../actionAxios';
import { IUser } from './userSlice';

export interface AuthState {
  isAuthenticated: boolean;
  loadingAuthentication: boolean;
  isAdmin: boolean;
  user: IUser | null;
  token: string | null;
  error?: string | null;
}
const initialState: AuthState = {
  loadingAuthentication: true,
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.isAuthenticated = true;
      state.loadingAuthentication = false;     
      state.user = action.payload.user;
      state.token = action.payload.token;
      setAuthToken(state.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    registerSuccess(state, action: PayloadAction<{ user: IUser; token: string }>) {
      state.isAuthenticated = true;
      state.loadingAuthentication = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      state.error = action.payload;
    },
    setProfile(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.isAdmin = action.payload.roles.some((role) => role.name === 'admin');
    },
  },
});

export const { login, logout, registerSuccess, registerFailure, setProfile } = authSlice.actions;


type TNewUser = {
  username: string;
  email: string;
  password: string;
}

export const register = (formData: TNewUser) => async (dispatch: Dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/register', formData);
    dispatch(registerSuccess({ user: response.data.user, token: response.data.token }));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      dispatch(registerFailure(error.response?.data.message));
    } else {
      dispatch(registerFailure('Error al registrar usuario'));
    }
    console.error('Error al registrar usuario', error);
    throw error;
  }
}

export const getProfile = () => async (dispatch: Dispatch, getState: () => { auth: AuthState }) => {
  try {
    const token = getState().auth.token
    setAuthToken(token)
    const response = await axiosInstance.get('/auth/profile');
    console.log('response getProfile', response)
    dispatch(setProfile(response.data));
  } catch (error) {
    console.error('Error al obtener el perfil del usuario', error);
  }
};

export default authSlice.reducer;

