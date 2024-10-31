import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import productsReducer from './slices/productSlice';
import shoppingCartReducer from "./slices/shippingCartSlice";
import suppliersReducer from './slices/supplierSlice';
import usersReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    notifications: notificationReducer,
    products: productsReducer,
    suppliers: suppliersReducer,
    shoppingCart: shoppingCartReducer
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