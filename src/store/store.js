import { configureStore } from '@reduxjs/toolkit';
import blockchainReducer from './blockchain.reducer';

export default configureStore({
  reducer: {
    blockchain: blockchainReducer,
  },
});
