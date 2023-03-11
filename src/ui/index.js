import { App } from './app';
import { DetailedGraph } from './components/graphs/detailed/detailed-graph';
import { OverviewGraph } from './components/graphs/overview/overview-graph';
import { ControlPanel } from './components/widgets/control-panel';
import { Notifications } from './components/widgets/notifications';
import { SelectionInfo } from './components/widgets/selection-info';

window.customElements.define(ControlPanel.tag, ControlPanel);
window.customElements.define(Notifications.tag, Notifications);
window.customElements.define(SelectionInfo.tag, SelectionInfo);
window.customElements.define(DetailedGraph.tag, DetailedGraph);
window.customElements.define(OverviewGraph.tag, OverviewGraph);
window.customElements.define(App.tag, App);
