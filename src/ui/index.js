import { App } from './app';
import { DetailedGraph } from './components/detailed-view/detailed-graph';
import { ControlPanel } from './components/widgets/control-panel';
import { Notifications } from './components/widgets/notifications';
import { SelectionInfo } from './components/widgets/selection-info';

window.customElements.define(ControlPanel.tag, ControlPanel);
window.customElements.define(Notifications.tag, Notifications);
window.customElements.define(SelectionInfo.tag, SelectionInfo);
window.customElements.define(DetailedGraph.tag, DetailedGraph);
window.customElements.define(App.tag, App);
