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
import { d3ForceGraph } from './components/detailed-view/force-graph';

export class App extends Base {
  static properties = {
    store: {},
  };

  constructor() {
    super();
    this.store = createNewStore();
  }

  connectedCallback() {
    super.connectedCallback();

    const fetchData = async () => {
      const api = await createConnection();
      // const api = await createApiMock(basicTestData);

      const settings = await api.getSettings();
      this.store.dispatch(setSettings(settings));

      const wallets = await api.getWallets();
      this.store.dispatch(addWallets(wallets));

      const model = await generateModel(this.store, api, wallets);
      this.store.dispatch(setBlockchain(model));
      console.log(model);
    };

    fetchData();
  }

  show() {
    return html`
    <style>${appCss}</style>

    <div class="page">
      <div class="detailed-view">
        <detailed-graph .store=${this.store}></detailed-graph>
      </div>

      <div class="widgets">
        <control-panel class='control' .store=${this.store}></control-panel>
        <notifications-panel class='notifications' .store=${this.store}></notifications-panel>
        <selection-info class='info' .store=${this.store}></selection-info>
      </div>

    </div>
    `;
  }

  static get tag() { return 'main-application'; }
}
