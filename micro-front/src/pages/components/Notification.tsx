import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../../store/store';
import { clearNotification } from '../../store/slices/notificationSlice';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (notification.message) {
      const message = typeof notification.message === 'string' ? notification.message : JSON.stringify(notification.message);
      toast[notification.type](message, {
        onClose: () => dispatch(clearNotification())
      });
    }
  }, [notification, dispatch]);

  return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />;
};

export default Notification;