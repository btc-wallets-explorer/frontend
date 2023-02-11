import watch from 'redux-watch';
import renderForceGraph from './ui/force-graph';

import { generateModel } from './loadBlockchain';
import { createNewStore } from './model/store';
import { setSettings } from './model/settings.reducer.';
import { addWallets } from './model/wallets.reducer';

import { createConnection, getSettings, getWallets } from './api';
import { mockBackend } from '../test/test-data/mock-backend';

const main = (async () => {
  const store = createNewStore();

  const observe = (path, callback) => store.subscribe(watch(store.getState, path)(callback));

  observe('blockchain', (blockchain) => renderForceGraph(blockchain, store.getState().settings));

  const fetchData = async () => {
    const connection = await createConnection();

    observe('wallets', (wallets) => generateModel(store, connection, wallets));
    const settings = await getSettings(connection);
    store.dispatch(setSettings(settings));

    const wallets = await getWallets(connection);
    store.dispatch(addWallets(wallets));
  };

  mockBackend(store);
  // fetchData();
});

main();
