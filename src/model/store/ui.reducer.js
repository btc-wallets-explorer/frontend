import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

export const VIEWING_MODES = Object.freeze({
  OVERVIEW: "overview",
  DETAIL: "deatil",
});

export const initialState = {
  mode: "overview",
  notifications: [],
  selections: [],
  scalars: {
    xAxis: 1,
    yAxis: 1,
    value: 1,
  },
  forceStrength: {
    charge: 0.1,
    link: 0.1,
    collide: 1.0,
    x: 0.1,
    y: 0.1,
  },
};
const slice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setViewingMode(state, action) {
      state.mode = action.payload;
    },
    setScalarValues(state, action) {
      state.scalars = {
        ...state.scalars,
        ...action.payload,
      };
    },
    setForceStrength(state, action) {
      state.forceStrength = {
        ...state.forceStrength,
        [action.payload.target]: action.payload.value,
      };
    },
    sendNotification(state, action) {
      state.notifications = [...state.notifications, action.payload];
    },
    addSelection(state, action) {
      state.selections = [...state.selections, action.payload];
    },
    removeSelection(state, action) {
      state.selections = state.selections.filter(
        (s) => !_.isEqual(s, action.payload),
      );
    },
    clearSelections(state) {
      state.selections = [];
    },
  },
});

export const {
  setViewingMode,
  setScalarValues,
  setForceStrength,
  sendNotification,
  addSelection,
  removeSelection,
  clearSelections,
} = slice.actions;

export default slice.reducer;
