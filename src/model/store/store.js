import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import watch from "redux-watch";
import blockchainReducer from "./blockchain.reducer";
import settingsReducer from "./settings.reducer.";
import uiReducer from "./ui.reducer";
import walletsReducer from "./wallets.reducer";
import { thunk } from "redux-thunk";
import overview from "./overview";

export const observe = (store, path, callback) =>
  store.subscribe(watch(store.getState, path)(callback));

export const createNewStore = () =>
  configureStore(
    {
      reducer: {
        overview: overview,
        blockchain: blockchainReducer,
        settings: settingsReducer,
        wallets: walletsReducer,
        ui: uiReducer,
      },
    },
    applyMiddleware(thunk),
  );
