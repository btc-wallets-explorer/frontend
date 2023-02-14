/* eslint-disable no-param-reassign */
import { createReducer, createAction } from '@reduxjs/toolkit';

export const setForceStrength = createAction('ui/force/set');
export const sendNotification = createAction('ui/notification/send');

export const uiReducer = createReducer(
  {
    notifications: [],
    forceStrength: {
      charge: 0.1,
      link: 0.1,
      collide: 0.1,
      x: 0.1,
      y: 0.1,
    },
  },
  (builder) => builder
    .addCase(setForceStrength, (state, action) => ({
      ...state,
      forceStrength: { ...state.forceStrength, [action.payload.target]: action.payload.value },
    }))
    .addCase(sendNotification, (state, action) => ({
      ...state,
      notifications: [...state.notifications, action.payload],
    })),
);
