import { html } from "lit";
import {
  loadBlockchain,
  loadSettings,
  loadWallets,
} from "../controller/fetch-data";

import { observe } from "../model/store/store";
import { States, getState } from "../state";
import appCss from "./app.css";
import { Base } from "./base";
import { VIEWING_MODES } from "../model/store/ui.reducer";

export class App extends Base {
  static properties = {
    mode: {},
  };

  constructor() {
    super();
    this.store = getState(States.STORE);
    this.mode = this.store.getState().ui.mode;
  }

  async connectedCallback() {
    super.connectedCallback();

    observe(this.store, "ui.mode", (mode) => {
      this.mode = mode;
    });

    const api = getState(States.API);
    await this.store.dispatch(loadSettings(api));
    await this.store.dispatch(loadWallets(api));
    this.store.dispatch(loadBlockchain(api));
  }

  show() {
    const isDetailMode = this.mode === VIEWING_MODES.DETAIL;
    return html`
      <style>
        ${appCss}
      </style>

      <div class="page">
        <div class="graph-view">
          <legend-widget class="legend"></legend-widget>
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
