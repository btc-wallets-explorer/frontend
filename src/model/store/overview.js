import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  nodes: [],
  links: [],
};

const slice = createSlice({
  name: "overview",
  initialState,
  reducers: {
    setOverviewNetwork: (state, action) => {
      state.nodes = action.payload.nodes;
      state.links = action.payload.links;
    },
  },
});

export const { setOverviewNetwork } = slice.actions;
export default slice.reducer;
