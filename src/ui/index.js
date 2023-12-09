import { App } from "./app";
import { DetailedGraph } from "./graphs/detailed/detailed-graph";
import { OverviewGraph } from "./graphs/overview/overview-graph";
import { ControlPanel } from "./widgets/control-panel";
import { Notifications } from "./widgets/notifications";
import { SelectionInfo } from "./widgets/selection-info";

export const registerWebComponents = () => {
  window.customElements.define(ControlPanel.tag, ControlPanel);
  window.customElements.define(Notifications.tag, Notifications);
  window.customElements.define(SelectionInfo.tag, SelectionInfo);
  window.customElements.define(DetailedGraph.tag, DetailedGraph);
  window.customElements.define(OverviewGraph.tag, OverviewGraph);
  window.customElements.define(App.tag, App);
};
