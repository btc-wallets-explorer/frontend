import { App } from './app';
import { ControlPanel } from './components/control-panel';
import { Notifications } from './components/notifications';
import { SelectionInfo } from './components/selection-info';

window.customElements.define(ControlPanel.tag, ControlPanel);
window.customElements.define(Notifications.tag, Notifications);
window.customElements.define(SelectionInfo.tag, SelectionInfo);
window.customElements.define(App.tag, App);
