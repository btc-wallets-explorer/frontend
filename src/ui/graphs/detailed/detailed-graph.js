import { html } from "lit";
import { observe } from "../../../model/store";
import { Base } from "../../base";
import css from "./detailed-graph.css";
import { d3ForceGraph } from "./d3-detailed-graph";

export class DetailedGraph extends Base {
  connectedCallback() {
    super.connectedCallback();

    observe(this.store, "blockchain", (blockchain) => {
      d3ForceGraph(
        this,
        this.store,
        blockchain,
        this.store.getState().settings,
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
    return "detailed-graph";
  }
}
