import { html } from 'lit';
import { Base } from './base';
import css from './control-panel.css';

export class Notifications extends Base {
  static properties = {
    notifications: [],
  };

  constructor() {
    super();
    this.notifications = [];
  }

  render() {
    const content = this.notifications.map((n) => html`${n.title}: ${n.content}`);
    return html`
      <styles>${css}</styles>
      <div class="notifications">
        ${content}
      </div>
    `;
  }

  static get tag() { return 'notifications-panel'; }
}
