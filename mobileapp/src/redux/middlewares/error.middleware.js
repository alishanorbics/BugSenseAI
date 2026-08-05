import { isRejectedWithValue } from '@reduxjs/toolkit';
import { showToast } from '../../helpers/toast';

const errorMiddleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const message = action.payload?.data?.message || 'Something went wrong.';

    showToast(message);
  }

  return next(action);
};

export default errorMiddleware;
