import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    id: number;
}

const initialState: NotificationState[] = [];

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification(state, action: PayloadAction<Omit<NotificationState, 'id'>>) {
            const id = new Date().getTime();
            state.push({ ...action.payload, id})
        },
        clearNotification(state, action: PayloadAction<number>) {
            return state.filter(notification => notification.id !== action.payload);
        },
    },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;