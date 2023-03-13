import { html } from 'lit';
import { setSettings } from '../model/settings.reducer.';
import { addWallets } from '../model/wallets.reducer';
import { generateModel } from '../modules/model-generation';

import { setBlockchain } from '../model/blockchain.reducer';
import { createApiMock } from '../../test/test-helpers';
import basicTestData from '../../test/test-data/basic-test-data';
import { createConnection } from '../modules/api';
import appCss from './app.css';
import { Base } from './components/base';
import { ELEMENTS, getState } from '../state';

export class App extends Base {
  static properties = {
    backendUrl: {},
  };

  constructor() {
    super();
    this.store = getState(ELEMENTS.STORE);
  }

  connectedCallback() {
    super.connectedCallback();

    const fetchData = async () => {
      const backendUrl = this.getAttribute('backend-url');
      console.log('Connecting to ', backendUrl);
      const api = await createConnection(backendUrl);
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
        <overview-graph></overview-graph>
      </div>

      <div class="widgets">
        <control-panel class='control'></control-panel>
        <notifications-panel class='notifications'></notifications-panel>
        <selection-info class='info'></selection-info>
      </div>

    </div>
    `;
  }

  static get tag() { return 'main-application'; }
}
