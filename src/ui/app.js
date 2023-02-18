import { html } from 'lit';
import { generateModel } from '../modules/model-generation';
import { setSettings } from '../model/settings.reducer.';
import { createNewStore, observe } from '../model/store';
import { addWallets } from '../model/wallets.reducer';

import { createConnection } from '../modules/api';
import { setBlockchain } from '../model/blockchain.reducer';
import { createApiMock } from '../../test/test-helpers';
import basicTestData from '../../test/test-data/basic-test-data';
import appCss from './app.css';
import { Base } from './components/base';
import { d3ForceGraph } from './force-graph/force-graph';

export class App extends Base {
  static css = appCss;

  static properties = {
    notifications: [],
    store: {},
    settings: {},
    model: {},
  };

  constructor() {
    super();
    this.notifications = [];
    this.store = createNewStore();
    this.model = {};
    this.settings = {};
  }

  connectedCallback() {
    super.connectedCallback();

    const fetchData = async () => {
      const api = await createConnection();
      // const api = await createApiMock(basicTestData);

      observe(this.store, 'wallets', async (wallets) => {
        this.model = await generateModel(this.store, api, wallets);
        console.log(this.model);
        d3ForceGraph(this.store, this.model, this.settings);
        this.store.dispatch(setBlockchain(this.model));
      });

      this.settings = await api.getSettings();
      this.store.dispatch(setSettings(this.settings));

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
