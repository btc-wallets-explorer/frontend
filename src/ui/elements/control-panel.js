import { html, LitElement, css } from 'lit';
import { setForceStrength } from '../../model/ui.reducer';

export class ControlPanel extends LitElement {
  static properties = {
    value: 0,
    store: {},
  };

  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--todo-list-text-color, #000);
    }
  `;

  render() {
    const onChange = (event) => this.store.dispatch(
      setForceStrength({ target: event.target.id, value: event.target.value / 100 }),
    );

    return html`
      <div class="slidecontainer">
        <label for='link'>Link force</label>
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="link">
        <label for='x'>X force</label>
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="x">
        <label for='y'>Y force</label>
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="y">
        <label for='charge'>Charge force</label>
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="charge">
        <label for='collide'>Collide force</label>
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="collide">
      </div>
    `;
  }
}
