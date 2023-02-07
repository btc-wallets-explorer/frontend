import { html, LitElement, css } from 'lit';

export class Counter extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--todo-list-text-color, #000);
    }
  `;

  render() {
    return html`
        Das ist ein Testsssss.
      <h2>TODO list</h2>
    `;
  }
}
