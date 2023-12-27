import * as d3 from "d3";
import { html } from "lit";
import { observe } from "../../../model/store/store";
import { Base } from "../../base";
import css from "./overview-graph.css";
import { renderGraph } from "./d3-overview-graph";
import { d3OverviewGraph } from "../../../controller/graph/overview/overview-network";

const RECT_WIDTH = 3;

export class OverviewGraph extends Base {
  /**
   * @override
   */
  constructor() {
    super();

    this.network = { nodes: [], links: [] };
    this.width = 1000;
    this.height = 600;
  }

  /**
   * @override
   */
  firstUpdated() {
    super.connectedCallback();

    observe(this.store, "blockchain", () => {
      this.store.dispatch(d3OverviewGraph());
    });

    observe(this.store, "overview", (overview) => {
      this.network = {
        nodes: overview.nodes,
        links: overview.links,
      };
      renderGraph(this, this.store, this.network, this.width, this.height);
    });
  }

  show() {
    return html`
      <style>
        ${css}
      </style>
      <div class="graph">
        <svg
          height="100%"
          width="100%"
          preserveAspectRatio="xMaxYMin slice"
          viewBox="0 0 ${this.width} ${this.height}"
        >
          <g class="canvas"></g>
        </svg>
      </div>
    `;
  }

  static get tag() {
    return "overview-graph";
  }
}
