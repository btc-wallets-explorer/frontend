import renderForceGraph from './ui/force-graph';

import { createConnection, getSettings, getWallets } from '../test/mocks/api.mock';
import generateModel from './model-generation';
import store from './store/store';

const main = (async () => {
  const connection = await createConnection();
  const wallets = await getWallets(connection);
  const settings = await getSettings(connection);

  store.subscribe(() => renderForceGraph(store.getState().blockchain, settings));

  await generateModel(connection, wallets);

});

main();
