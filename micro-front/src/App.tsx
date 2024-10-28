import { useDispatch } from 'react-redux';
import AppRouters from './routers/AppRouters';
import Notification from './pages/components/Notification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css'
import { useEffect } from 'react';
import { login } from './store/slices/authSlice';
import ErrorBoundary from './components/ErrprBoundary';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch(login({ user: parsedUser, token: token }));
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const scale = 0.8;
    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = '0 0';
    document.body.style.width = `${100 / scale}%`;
    document.body.style.height = `${100 / scale}%`;
  }, []);

  return (
    <ErrorBoundary>
      <Notification/>
      <AppRouters/>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </ErrorBoundary>
  );
}

export default App;