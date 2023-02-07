import renderForceGraph from './ui/force-graph';

import { createConnection, getSettings, getWallets } from '../test/mocks/api.mock';
import generateModel from './loadBlockchain';
import store from './store/store';

const main = (async () => {
  const connection = await createConnection();

  const wallets = await getWallets(connection);

  // const fetchSettings = async () => {
  //   const settings = await getSettings(connection);
  //   store.dispatch(settings.actions)
  // };

  store.subscribe(() => renderForceGraph(store.getState().blockchain, store.getState().settings));

  generateModel(connection, wallets);
});

main();
