import { Server } from "mock-socket";
import { initialize } from "../../src/init";
import { States, getState } from "../../src/state";
import { App } from "../../src/view/app";
import { DetailedGraph } from "../../src/view/graphs/detailed/detailed-graph";
import { OverviewGraph } from "../../src/view/graphs/overview/overview-graph";
import { ControlPanel } from "../../src/view/widgets/control-panel";
import { Notifications } from "../../src/view/widgets/notifications";
import { SelectionInfo } from "../../src/view/widgets/selection-info";

describe("Main", () => {
  it("sets up the state and registers web components", async () => {
    const mockUrl = "ws://localhost:9999";

    const mockServer = new Server(mockUrl);
    mockServer.on("connection", () => {});

    window.bwe = { "backend-url": mockUrl };
    await initialize();

    const store = getState(States.STORE);
    expect(store).toBeDefined();

    const connection = getState(States.API);
    expect(connection).toBeDefined();

    const components = [
      App,
      OverviewGraph,
      DetailedGraph,
      ControlPanel,
      Notifications,
      SelectionInfo,
    ];

    components.forEach((component) => {
      // eslint-disable-next-line new-cap
      expect(new (window.customElements.get(component.tag))()).toEqual(
        new component(),
      );
    });
  });
});
