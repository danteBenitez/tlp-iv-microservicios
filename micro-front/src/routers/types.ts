export interface AuthState {
    isAuthenticated: boolean;
}

export interface RootState {
    auth: AuthState;
}