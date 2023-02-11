import { html, LitElement, css } from 'lit';
import { setValue } from '../../model/ui.reducer';

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
    const onChange = (event) => this.store.dispatch(setValue(event.target.value));
    return html`
      <div class="slidecontainer">
        <input @input=${onChange} type="range" min="1" max="100" value=${this.value} class="slider" id="myRange">
      </div>
    `;
  }
}
