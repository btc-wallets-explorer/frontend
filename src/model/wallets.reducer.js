/* eslint-disable no-param-reassign */
import { createReducer, createAction } from '@reduxjs/toolkit';

export const addWallets = createAction('wallets/add');
export const removeWallets = createAction('wallets/remove');
export const clearWallets = createAction('wallets/clear');

export const walletsReducer = createReducer(
  [],
  (builder) => builder
    .addCase(addWallets, (state, action) => [...state, ...action.payload])
    .addCase(
      removeWallets,
      (state, action) => state.filter((w) => !action.payload.includes(w.name)),
    )
    .addCase(clearWallets, () => []),
);
