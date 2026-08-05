import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  first_launch: true,
  app_config: {},
};

const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    setFirstLaunch: (state, action) => {
      state.first_launch = action.payload;
    },
    setAppConfig: (state, action) => {
      state.app_config = { ...state.app_config, ...action.payload };
    },
  },
});

export const { setFirstLaunch, setAppConfig } = generalSlice.actions;
export default generalSlice.reducer;
