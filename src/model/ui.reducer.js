/* eslint-disable no-param-reassign */
import { createReducer, createAction } from "@reduxjs/toolkit";
import _ from "lodash";

export const VIEWING_MODES = Object.freeze({
  OVERVIEW: "overview",
  DETAIL: "deatil",
});

export const setViewingMode = createAction("ui/mode/set");

export const setForceStrength = createAction("ui/force/set");

export const sendNotification = createAction("ui/notification/send");

export const addSelection = createAction("ui/selection/add");
export const removeSelection = createAction("ui/selection/remove");
export const clearSelections = createAction("ui/selection/clear");

export const uiReducer = createReducer(
  {
    mode: "overview",
    notifications: [],
    selections: [],
    forceStrength: {
      charge: 0.1,
      link: 0.1,
      collide: 1.0,
      x: 0.1,
      y: 0.1,
    },
  },
  (builder) =>
    builder
      .addCase(setViewingMode, (state, action) => ({
        ...state,
        mode: action.payload,
      }))
      .addCase(setForceStrength, (state, action) => ({
        ...state,
        forceStrength: {
          ...state.forceStrength,
          [action.payload.target]: action.payload.value,
        },
      }))
      .addCase(sendNotification, (state, action) => ({
        ...state,
        notifications: [...state.notifications, action.payload],
      }))
      .addCase(addSelection, (state, action) => ({
        ...state,
        selections: [...state.selections, action.payload],
      }))
      .addCase(removeSelection, (state, action) => ({
        ...state,
        selections: state.selections.filter(
          (s) => !_.isEqual(s, action.payload),
        ),
      }))
      .addCase(clearSelections, (state) => ({
        ...state,
        selections: [],
      })),
);
