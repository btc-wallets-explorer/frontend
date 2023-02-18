import { html, LitElement } from 'lit';
import baseCss from './base.css';

export class Base extends LitElement {
  static properties = {
    store: {},
  };

  // eslint-disable-next-line class-methods-use-this
  show() {
    throw new TypeError('show method not implemented');
  }

  render() {
    return html`
      <style>${baseCss}</style>
      <div class='base'>
        ${this.show()}
      </div>
    `;
  }
}
