import { configureStore } from '@reduxjs/toolkit';
import pricingReducer from './slices/pricingSlice';

export const store = configureStore({
  reducer: {
    pricing: pricingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store; 