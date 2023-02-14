import { App } from './app';
import { ControlPanel } from './elements/control-panel';
import { Notifications } from './elements/notifications';

window.customElements.define(ControlPanel.tag, ControlPanel);
window.customElements.define(Notifications.tag, Notifications);
window.customElements.define(App.tag, App);
