import { createSlice } from '@reduxjs/toolkit';

const aiSlice = createSlice({
  name: 'ai',
  initialState: { 
    analysis: null, 
    recipes: [], 
    loading: false 
  },
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload; },
    setAIResult: (state, action) => {
      state.analysis = action.payload.ai_analysis;
      state.recipes = action.payload.recommended_recipes;
      state.loading = false;
    },
    clearAll: (state) => {
      state.analysis = null;
      state.recipes = [];
    }
  }
});

export const { setLoading, setAIResult, clearAll } = aiSlice.actions;
export default aiSlice.reducer;