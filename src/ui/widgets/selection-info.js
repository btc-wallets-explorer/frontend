import { html } from 'lit';
import { observe } from '../../model/store';
import { Base } from '../base';
import css from './selection-info.css';

export class SelectionInfo extends Base {
  static properties = {
    selections: {},
  };

  constructor() {
    super();
    this.selections = [];
  }

  connectedCallback() {
    super.connectedCallback();
    observe(this.store, 'ui.selections', (selections) => {
      this.selections = selections;
    });
  }

  show() {
    const content = this.selections.map((s) => {
      if (s.type === 'transaction') {
        const tx = this.store.getState().blockchain.transactions[s.id];
        return html`<pre>${JSON.stringify(tx, null, 2)}</pre>`;
      }
      return html`${s.type}: ${s.id}<br/>`;
    });
    return html`
      <style>${css}</style>
      <div class="container">
        ${content}
      </div>
    `;
  }

  static get tag() { return 'selection-info'; }
}
