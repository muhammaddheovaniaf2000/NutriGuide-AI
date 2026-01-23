import { configureStore } from '@reduxjs/toolkit';
// Nanti kita akan import reducer di sini, sementara biarkan kosong dulu
// import recipeReducer from './slices/recipeSlice';

export const store = configureStore({
  reducer: {
    // recipes: recipeReducer,
  },
});