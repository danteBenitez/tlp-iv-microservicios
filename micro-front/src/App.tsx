import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrprBoundary";
import "./global.css";
import Notification from "./pages/components/Notification";
import AppRouters from "./routers/AppRouters";
import { getProfile, login } from "./store/slices/authSlice";
import { connect } from "./store/slices/socketSlice";
import { AppDispatch, RootState } from "./store/store";

function App() {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(login({ user: parsedUser, token: token }));
        dispatch(getProfile());
        dispatch(connect());
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    }
  }, [dispatch, token]);

  useEffect(() => {
    const scale = 0.8;
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = "0 0";
    document.body.style.width = `${100 / scale}%`;
    document.body.style.height = `${100 / scale}%`;
  }, []);

  return (
    <ErrorBoundary>
      <Notification />
      <AppRouters />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ErrorBoundary>
  );
}

export default App;
