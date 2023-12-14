import { html } from "lit";
import { setSettings } from "../model/settings.reducer.";
import { addWallets } from "../model/wallets.reducer";
import { generateModel } from "../modules/model-generation";

import { setBlockchain } from "../model/blockchain.reducer";
import { observe } from "../model/store";
import { ELEMENTS, getState } from "../state";
import appCss from "./app.css";
import { Base } from "./base";
import { VIEWING_MODES } from "../model/ui.reducer";
import { createApiMock } from "../../test/test-helpers";
import basicTestData from "../../test/test-data/basic-test-data";

export class App extends Base {
  static properties = {
    mode: {},
  };

  constructor() {
    super();
    this.store = getState(ELEMENTS.STORE);
    this.mode = this.store.getState().ui.mode;
  }

  connectedCallback() {
    super.connectedCallback();

    observe(this.store, "ui.mode", (mode) => {
      this.mode = mode;
    });

    const fetchData = async () => {
      const api = getState(ELEMENTS.BACKEND_CONNECTION);
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
    const isDetailMode = this.mode === VIEWING_MODES.DETAIL;
    return html`
      <style>
        ${appCss}
      </style>

      <div class="page">
        <div class="graph-view">
          <legend-panel class="legend"></legend-panel>
          <overview-graph
            style="display: ${isDetailMode ? "none" : "block"}"
          ></overview-graph>
          <detailed-graph
            style="display: ${isDetailMode ? "block" : "none"}"
          ></detailed-graph>
        </div>

        <div class="widgets">
          <control-panel class="control"></control-panel>
          <notifications-panel class="notifications"></notifications-panel>
          <selection-info class="info"></selection-info>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "main-application";
  }
}
