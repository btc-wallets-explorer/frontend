import { html } from 'lit';
import { setForceStrength } from '../../model/ui.reducer';
import { Base } from './base';
import css from './control-panel.css';

export class ControlPanel extends Base {
  static css = css;

  connectedCallback() {
    super.connectedCallback();
    this.forceStrength = this.store.getState().ui.forceStrength;
  }

  render() {
    console.log(this.forceStrength);
    const onChange = (event) => this.store.dispatch(
      setForceStrength({ target: event.target.id, value: event.target.value / 100 }),
    );

    const forceControl = ['link', 'charge', 'collide', 'x', 'y'].map((force) => html`
        <div class="item">
          <label for=${force}>${force} force</label>
          <input @input=${onChange} type="range" min="1" max="100" value=${this.forceStrength[force]} class="slider" id=${force}>
        </div>
      `);

    return html`
      <div class="container">
        ${forceControl}
      </div>
    `;
  }

  static get tag() { return 'control-panel'; }
}
