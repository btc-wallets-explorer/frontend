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
  static properties = {
    notifications: [],
    store: {},
    settings: {},
    model: {},
  };

  constructor() {
    super();
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
        this.store.dispatch(setBlockchain(this.model));

        console.log(this.model);

        d3ForceGraph(this.store, this.model, this.settings);
      });

      this.settings = await api.getSettings();
      this.store.dispatch(setSettings(this.settings));

      const wallets = await api.getWallets();
      this.store.dispatch(addWallets(wallets));
    };

    fetchData();
  }

  show() {
    return html`
    <style>${appCss}</style>
    <div class='container'>
      <control-panel class='control' .store=${this.store}></control-panel>
      <notifications-panel class='notifications' .store=${this.store}></notifications-panel>
      <selection-info class='info' .store=${this.store}></selection-info>
    </div>
    `;
  }

  static get tag() { return 'main-application'; }
}
