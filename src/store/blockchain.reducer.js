/* eslint-disable no-param-reassign */
import { createReducer, createAction } from '@reduxjs/toolkit';

export const setBlockchain = createAction('set');

export const blockchainReducer = createReducer(
  {
    transactions: {},
    scriptHashes: {},
    utxos: {},
  },
  (builder) => builder.addCase(setBlockchain, (state, action) => action.payload),
);
