import { html } from "lit";
import { classMap } from "lit-html/directives/class-map.js";
import { observe } from "../../model/store";
import {
  VIEWING_MODES,
  setForceStrength,
  setScalarValues,
  setViewingMode,
} from "../../model/ui.reducer";
import { Base } from "../base";
import css from "./control-panel.css";

export class ControlPanel extends Base {
  static properties = {
    mode: {},
  };

  constructor() {
    super();
    this.mode = "overview";
  }

  connectedCallback() {
    super.connectedCallback();
    this.forceStrength = this.store.getState().ui.forceStrength;
    this.scalars = this.store.getState().ui.scalars;

    observe(this.store, "ui.mode", (mode) => {
      this.mode = mode;
    });
  }

  show() {
    const onForceChange = (event) =>
      this.store.dispatch(
        setForceStrength({
          target: event.target.id,
          value: event.target.value / 100,
        }),
      );

    const forceControl = ["link", "charge", "collide", "x", "y"].map(
      (force) => html`
        <div class="item">
          <label for=${force}>${force} force</label>
          <input
            @input=${onForceChange}
            type="range"
            min="1"
            max="100"
            value=${this.forceStrength[force]}
            class="slider"
            id=${force}
          />
        </div>
      `,
    );

    const onScalarChange = (event) => {
      this.store.dispatch(
        setScalarValues({
          [event.target.id]: event.target.value,
        }),
      );
    };
    const overviewControl = ["xAxis", "yAxis", "value"].map(
      (scalar) => html`
        <div class="item">
          <label for=${scalar}>${scalar} scalar</label>
          <input
            @input=${onScalarChange}
            type="range"
            min="0.001"
            max="100"
            value=${this.scalars[scalar]}
            class="slider"
            id=${scalar}
          />
        </div>
      `,
    );

    const toggleMode = (detailedMode) => {
      this.store.dispatch(
        setViewingMode(
          detailedMode ? VIEWING_MODES.DETAIL : VIEWING_MODES.OVERVIEW,
        ),
      );
    };

    return html`
      <style>
        ${css}
      </style>
      <div class="container">
        <label>
          <input
            id="toggle-mode"
            type="checkbox"
            @click=${(e) => toggleMode(e.target.checked)}
          />
          <span>Detail mode</span>
        </label>
        <div
          class="force-control ${classMap({
            disabled: this.mode === "overview",
          })}"
        >
          ${forceControl}
        </div>
        <div
          class="force-control ${classMap({
            disabled: this.mode !== "overview",
          })}"
        >
          ${overviewControl}
        </div>
      </div>
    `;
  }

  static get tag() {
    return "control-panel";
  }
}
