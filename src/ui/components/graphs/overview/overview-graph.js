import { html } from 'lit';
import { observe } from '../../../../model/store';
import { Base } from '../../base';
import css from './overview-graph.css';
import { sankeyGraph } from './sankey-graph';

export class OverviewGraph extends Base {
  connectedCallback() {
    super.connectedCallback();

    observe(this.store, 'blockchain', (blockchain) => {
      sankeyGraph(this, this.store, blockchain, this.store.getState().settings);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  show() {
    return html`
      <style>${css}</style>
      <div class="graph">
      </div>
    `;
  }

  static get tag() { return 'overview-graph'; }
}
