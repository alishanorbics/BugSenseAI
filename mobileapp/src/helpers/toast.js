import { createRef } from 'react';

export const toastRef = createRef();

export const showToast = (message, type = 'error') => {
  toastRef.current?.show(message, type);
};
