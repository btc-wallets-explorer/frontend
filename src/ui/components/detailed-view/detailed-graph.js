import { html } from 'lit';
import { observe } from '../../../model/store';
import { Base } from '../base';
import css from './detailed-graph.css';
import { d3ForceGraph } from './force-graph';

export class DetailedGraph extends Base {
  connectedCallback() {
    super.connectedCallback();

    observe(this.store, 'blockchain', (blockchain) => {
      d3ForceGraph(this, this.store, blockchain, this.store.getState().settings);
    });
  }

  show() {
    return html`
      <style>${css}</style>
      <div class="graph">
      </div>
    `;
  }

  static get tag() { return 'detailed-graph'; }
}
