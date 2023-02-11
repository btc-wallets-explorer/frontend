import { setBlockchain } from '../../src/model/blockchain.reducer';
import { setSettings } from '../../src/model/settings.reducer.';
import { addWallets } from '../../src/model/wallets.reducer';
import data from './basic-test-data';

export const mockBackend = (store) => {
  store.dispatch(setSettings(data.settings));
  store.dispatch(addWallets(data.wallets));
  store.dispatch(setBlockchain(data.blockchain));
};
