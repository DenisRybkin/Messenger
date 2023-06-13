'use client';

import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { cssTransition, ToastContainer } from 'react-toastify';

const bounceTransition = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut',
});

export const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={6000}
      closeButton
      pauseOnHover
      closeOnClick
      newestOnTop
      limit={5}
      theme="light"
      transition={bounceTransition}
    />
  );
};
