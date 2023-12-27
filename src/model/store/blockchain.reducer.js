import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  transactions: {},
  scriptHashes: {},
  utxos: {},
};

export const slice = createSlice({
  name: "blockchain",
  initialState,
  reducers: {
    setBlockchain: (_, action) => action.payload,
  },
});

export const { setBlockchain } = slice.actions;
export default slice.reducer;
