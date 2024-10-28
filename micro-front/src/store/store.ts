import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import usersReducer from './slices/userSlice';
import incidentReducer from './slices/incidentSlice';
import employeesReducer from './slices/employeeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    incidents: incidentReducer,
    notifications: notificationReducer,
    employees: employeesReducer,
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