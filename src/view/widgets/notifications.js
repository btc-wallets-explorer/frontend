import { html } from "lit";
import { observe } from "../../model/store/store";
import { Base } from "../base";
import css from "./notifications.css";

export class Notifications extends Base {
  static properties = {
    notifications: {},
  };

  constructor() {
    super();
    this.notifications = [];
  }

  connectedCallback() {
    super.connectedCallback();
    observe(this.store, "ui.notifications", (notifications) => {
      this.notifications = notifications;
    });
  }

  show() {
    const content = this.notifications.map(
      (n) => html`${n.title}: ${n.content}<br />`,
    );
    return html`
      <style>
        ${css}
      </style>
      <div class="container">${content}</div>
    `;
  }

  static get tag() {
    return "notifications-panel";
  }
}
