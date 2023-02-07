/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const blockchainSlice = createSlice({
  name: 'blockchain',
  initialState: {
    transactions: {},
    scriptHashes: {},
    utxos: {},
  },
  reducers: {
    setModel: (state, action) => {
      state.transactions = action.payload.transactions;
      state.scriptHashes = action.payload.scriptHashes;
      state.utxos = action.payload.utxos;
    },
  },
});

export const { setModel } = blockchainSlice.actions;

export default blockchainSlice.reducer;
