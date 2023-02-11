/* eslint-disable no-param-reassign */
import { createReducer, createAction } from '@reduxjs/toolkit';

export const setValue = createAction('ui/value/set');

export const uiReducer = createReducer(
  {
    value: 5,
  },
  (builder) => builder.addCase(setValue, (state, action) => ({ ...state, value: action.payload })),
);
