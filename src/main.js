import watch from 'redux-watch';
import renderForceGraph from './ui/force-graph';

import { createConnection, getSettings, getWallets } from '../test/mocks/api.mock';
import { generateModel } from './loadBlockchain';
import { createNewStore } from './model/store';
import { setSettings } from './model/settings.reducer.';
import { addWallets } from './model/wallets.reducer';

const main = (async () => {
  const store = createNewStore();
  const connection = await createConnection();

  const fetchData = async () => {
    const settings = await getSettings(connection);
    store.dispatch(setSettings(settings));

    const wallets = await getWallets(connection);
    store.dispatch(addWallets(wallets));
  };

  const observe = (path, callback) => store.subscribe(watch(store.getState, path)(callback));

  observe('wallets', (wallets) => generateModel(store, connection, wallets));
  observe('blockchain', (blockchain) => renderForceGraph(blockchain, store.getState().settings));

  fetchData(connection);
});

main();
