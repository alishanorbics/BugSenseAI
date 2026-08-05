import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../apis/Auth';

const initialState = {
  user: null,
  token: null,
  is_authenticated: false,
};

const setCredentials = (state, action) => {
  const { user, token } = action.payload?.data || {};
  state.user = user;
  state.token = token;
  state.is_authenticated = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, setCredentials)
      .addMatcher(authApi.endpoints.register.matchFulfilled, setCredentials);
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
