import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
// import { Toast, ToastContainer } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../../store/store';
import { clearNotification } from '../../store/slices/notificationSlice';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    notifications.forEach(notification => {
      toast[notification.type](notification.message, {
        onClose: () => dispatch(clearNotification(notification.id)),
      });
    });
    // const timers = notifications.map(notification =>
    //     setTimeout(() => {
    //         dispatch(clearNotification(notification.id));
    //     }, 3000)
    // );

    // return () => {
    //     timers.forEach(timer => clearTimeout(timer));
    // };
}, [notifications, dispatch]);

return <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />;
// return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />;
// return (
//     <ToastContainer position="top-end" className="p-3">
//         {notifications.map(notification => (
//             <Toast key={notification.id} bg={notification.type}>
//                 <Toast.Body>{notification.message}</Toast.Body>
//             </Toast>
//         ))}
//     </ToastContainer>
// );
    };

export default Notification;