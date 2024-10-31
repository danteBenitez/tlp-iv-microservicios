export interface AuthState {
    isAuthenticated: boolean;
    loadingAuthentication: boolean;
}

export interface RootState {
    auth: AuthState;
}