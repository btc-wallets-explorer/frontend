import { html, LitElement } from 'lit';
import { setForceStrength } from '../../model/ui.reducer';
import css from './control-panel.css';

export class ControlPanel extends LitElement {
  static properties = {
    value: 0,
    store: {},
  };

  render() {
    const onChange = (event) => this.store.dispatch(
      setForceStrength({ target: event.target.id, value: event.target.value / 100 }),
    );

    const forceControl = ['link', 'charge', 'collide', 'x', 'y'].map((force) => html`
        <div class="item">
          <label for=${force}>${force} force</label>
          <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id=${force}>
        </div>
      `);

    return html`
      <styles>${css}</styles>
      <div class="container">
        ${forceControl}
      </div>
    `;
  }
}
