import { html } from 'lit';
import { observe } from '../../model/store';
import { Base } from './base';
import css from './control-panel.css';

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
    observe(this.store, 'ui.notifications', (notifications) => {
      this.notifications = notifications;
    });
  }

  render() {
    const content = this.notifications.map((n) => html`${n.title}: ${n.content}<br/>`);
    return html`
      <styles>${css}</styles>
      <div class="notifications">
        ${content}
      </div>
    `;
  }

  static get tag() { return 'notifications-panel'; }
}
