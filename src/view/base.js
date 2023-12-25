import { html, LitElement } from "lit";
import { States, getState } from "../state";
import baseCss from "./base.css";

export class Base extends LitElement {
  constructor() {
    super();
    this.store = getState(States.STORE);
  }

  // eslint-disable-next-line class-methods-use-this
  show() {
    throw new TypeError("show method not implemented");
  }

  render() {
    return html`
      <style>
        ${baseCss}
      </style>
      <div class="base">${this.show()}</div>
    `;
  }
}
