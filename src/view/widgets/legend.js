import * as d3 from "d3";
import { html } from "lit";
import { classMap } from "lit-html/directives/class-map.js";
import { observe } from "../../model/store/store";
import { Base } from "../base";
import css from "./legend.css";

export class Kegebd extends Base {
  static properties = {
    walletsNames: [],
  };

  constructor() {
    super();
    this.walletsNames = [];
    this.colorLinks = d3.scaleOrdinal(d3.schemeCategory10);
  }

  connectedCallback() {
    super.connectedCallback();

    this.walletsNames = this.store.getState().wallets.map((w) => w.name);

    observe(this.store, "wallets", (wallets) => {
      this.walletsNames = wallets.map((w) => w.name);
    });
  }

  show() {
    return html`
      <style>
        ${css}
      </style>
      <div class="container">
        ${this.walletsNames.map(
          (name) =>
            html`<div class="entry">
              <div
                class="color"
                style="background-color:${this.colorLinks(name)}"
              ></div>
              <div class="label">${name}</div>
            </div>`,
        )}
      </div>
    `;
  }

  static get tag() {
    return "legend-widget";
  }
}
