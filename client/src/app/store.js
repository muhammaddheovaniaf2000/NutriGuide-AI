import { configureStore } from '@reduxjs/toolkit';
import aiReducer from '../features/aiSlice';

export const store = configureStore({
  reducer: {
    ai: aiReducer,
  },
});