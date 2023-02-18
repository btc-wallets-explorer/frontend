import { App } from './app';
import { ControlPanel } from './components/control-panel';
import { Notifications } from './components/notifications';

window.customElements.define(ControlPanel.tag, ControlPanel);
window.customElements.define(Notifications.tag, Notifications);
window.customElements.define(App.tag, App);
