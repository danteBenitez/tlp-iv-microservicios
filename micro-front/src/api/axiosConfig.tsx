import axios from "axios";
import store from "../store/store";
import { logout } from "../store/slices/authSlice";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle 401 error
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            store.dispatch(logout());

            window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;

export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};