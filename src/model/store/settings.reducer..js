/* eslint-disable no-param-reassign */
import { createReducer, createAction } from "@reduxjs/toolkit";

export const setSettings = createAction("settings/set");

export const settingsReducer = createReducer(
  {
    "block-explorer-url": "",
  },
  (builder) => builder.addCase(setSettings, (state, action) => action.payload),
);
