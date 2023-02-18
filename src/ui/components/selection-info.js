import { html } from 'lit';
import { observe } from '../../model/store';
import { Base } from './base';

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
    observe(this.store, 'ui.selection', (selections) => {
      this.selections = selections;
    });
  }

  render() {
    const content = this.selections.map((s) => html`${s.type}: ${s.id}<br/>`);
    return html`
      <div class="notifications">
        ${content}
      </div>
    `;
  }

  static get tag() { return 'selection-info'; }
}
