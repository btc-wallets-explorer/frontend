import { html } from "lit";
import { observe } from "../../../model/store";
import { Base } from "../../base";
import css from "./overview-graph.css";
import { d3OverviewGraph } from "./d3-overview-graph";

export class OverviewGraph extends Base {
  connectedCallback() {
    super.connectedCallback();

    observe(this.store, "blockchain", (blockchain) => {
      d3OverviewGraph(
        this,
        this.store,
        blockchain,
        this.store.getState().settings,
        this.store.getState().wallets,
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  show() {
    return html`
      <style>
        ${css}
      </style>
      <div class="graph"></div>
    `;
  }

  static get tag() {
    return "overview-graph";
  }
}
