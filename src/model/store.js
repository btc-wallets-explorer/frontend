import { configureStore } from '@reduxjs/toolkit';
import { blockchainReducer } from './blockchain.reducer';
import { settingsReducer } from './settings.reducer.';
import { uiReducer } from './ui.reducer';
import { walletsReducer } from './wallets.reducer';

export const createNewStore = () => configureStore({
  reducer: {
    blockchain: blockchainReducer,
    settings: settingsReducer,
    wallets: walletsReducer,
    ui: uiReducer,
  },
});
