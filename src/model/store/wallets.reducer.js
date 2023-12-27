import { createSlice } from "@reduxjs/toolkit";

export const initialState = [];

const slice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallets: (_, action) => action.payload,
    removeWallets: (state, action) =>
      state.filter((w) => !action.payload.includes(w.name)),
    clearWallets: () => [],
  },
});

export const { addWallets, removeWallets, clearWallets } = slice.actions;
export default slice.reducer;
