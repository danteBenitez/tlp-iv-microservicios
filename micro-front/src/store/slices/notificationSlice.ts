import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NotificationState {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

const initialState: NotificationState = {
    message: '',
    type: 'info',
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showNotification(state, action: PayloadAction<NotificationState>) {
            state.message = action.payload.message;
            state.type = action.payload.type;
        },
        clearNotification(state) {
            state.message = '';
            state.type = 'info';
        },
    },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;