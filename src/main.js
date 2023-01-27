import { createConnection, getSettings, getWallets } from './api';
import generateModel from './model-generation';

import renderForceGraph from './ui/force-graph';

const main = (async () => {
  const connection = await createConnection();
  const wallets = await getWallets(connection);
  const settings = await getSettings(connection);

  const model = await generateModel(connection, wallets);
  console.log(model);

  renderForceGraph(model, settings);
});

main();
