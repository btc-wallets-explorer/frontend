import { html } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { observe } from '../../../model/store';
import { setForceStrength, setViewingMode } from '../../../model/ui.reducer';
import { Base } from '../base';
import css from './control-panel.css';

export class ControlPanel extends Base {
  static properties = {
    mode: {},
  };

  constructor() {
    super();
    this.mode = 'overview';
  }

  connectedCallback() {
    super.connectedCallback();
    this.forceStrength = this.store.getState().ui.forceStrength;

    observe(this.store, 'ui.mode', (mode) => { this.mode = mode; });
  }

  show() {
    const onChange = (event) => this.store.dispatch(
      setForceStrength({ target: event.target.id, value: event.target.value / 100 }),
    );

    const forceControl = ['link', 'charge', 'collide', 'x', 'y'].map((force) => html`
        <div class="item">
          <label for=${force}>${force} force</label>
          <input @input=${onChange} type="range" min="1" max="100" value=${this.forceStrength[force]} class="slider" id=${force}>
        </div>
      `);

    const toggleMode = (detailedMode) => {
      this.store.dispatch(setViewingMode(detailedMode ? 'detail' : 'overview'));
    };

    return html`
      <style>${css}</style>
      <div class="container">
        <label>
          <input id="toggle-mode" type="checkbox" @click=${(e) => toggleMode(e.target.checked)}>
          <span>Detail mode</span>
        </label>
        <div class='force-control ${classMap({ disabled: this.mode === 'overview' })}'>
          ${forceControl}
        </div>
      </div>
    `;
  }

  static get tag() { return 'control-panel'; }
}
