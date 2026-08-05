import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { baseApi } from '../apis/Base';
import { authApi } from '../apis/Auth';
import errorMiddleware from '../middlewares/error.middleware';
import authReducer from '../slices/auth.slice';
import generalReducer from '../slices/general.slice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'general'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  general: generalReducer,
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }).concat(baseApi.middleware, authApi.middleware, errorMiddleware),
});

export const persistor = persistStore(store);
