import { html, LitElement } from 'lit';
import { generateModel } from '../modules/model-generation';
import { setSettings } from '../model/settings.reducer.';
import { createNewStore, observe } from '../model/store';
import { addWallets } from '../model/wallets.reducer';
import renderForceGraph from './force-graph';

import { createConnection } from '../modules/api';
import { setBlockchain } from '../model/blockchain.reducer';
import { createApiMock } from '../../test/test-helpers';
import basicTestData from '../../test/test-data/basic-test-data';

export class App extends LitElement {
  static properties = {
    notifications: [],
    store: {},
  };

  constructor() {
    super();
    this.notifications = [];
    this.store = createNewStore();

    observe(this.store, 'blockchain', (blockchain) => renderForceGraph(this.store, blockchain, this.store.getState().settings));

    const fetchData = async () => {
      const api = await createConnection();
      // const api = await createApiMock(basicTestData);

      observe(this.store, 'wallets', async (wallets) => {
        const model = await generateModel(this.store, api, wallets);
        console.log(model);
        this.store.dispatch(setBlockchain(model));
      });

      const settings = await api.getSettings();
      this.store.dispatch(setSettings(settings));

      const wallets = await api.getWallets();
      this.store.dispatch(addWallets(wallets));
    };

    fetchData();
  }

  render() {
    return html`
    <control-panel .store=${this.store} .value=${5}></control-panel>
    <notifications-panel .store=${this.store} .notifications=${this.notifications}></notifications-panel>
    `;
  }

  static get tag() { return 'main-application'; }
}
