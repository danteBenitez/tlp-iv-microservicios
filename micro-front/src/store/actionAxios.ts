import axios from "axios";
// import { Dispatch } from "redux";
// import { RootState } from "./store";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;

export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

// export const fetchUsers = () => async (dispatch: Dispatch, getState: () => RootState) => {
//     try {
//         const token = getState().auth.token;
//         setAuthToken(token);
//         const response = await axiosInstance.get('/users');
//         dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
//     } catch (error: any) {
//         dispatch({ type: 'FETCH_USERS_FAILURE', payload: error.message });
//     }
// }
