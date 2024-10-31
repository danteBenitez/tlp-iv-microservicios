import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import usersReducer from './slices/userSlice';
import productsReducer from './slices/productSlice';
import suppliersReducer from './slices/supplierSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notifications: notificationReducer,
    products: productsReducer,
    suppliers: suppliersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;