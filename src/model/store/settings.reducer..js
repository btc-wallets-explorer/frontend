import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  "block-explorer-url": "",
};

export const slice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (_, action) => action.payload,
  },
});

export const { setSettings } = slice.actions;

export default slice.reducer;
