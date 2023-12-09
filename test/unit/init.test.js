import { Server } from "mock-socket";
import { initialize } from "../../src/init";
import { ELEMENTS, getState } from "../../src/state";
import { App } from "../../src/ui/app";
import { DetailedGraph } from "../../src/ui/graphs/detailed/detailed-graph";
import { OverviewGraph } from "../../src/ui/graphs/overview/overview-graph";
import { ControlPanel } from "../../src/ui/widgets/control-panel";
import { Notifications } from "../../src/ui/widgets/notifications";
import { SelectionInfo } from "../../src/ui/widgets/selection-info";

describe("Main", () => {
  it("sets up the state and registers web components", async () => {
    const mockUrl = "ws://localhost:9999";

    const mockServer = new Server(mockUrl);
    mockServer.on("connection", () => {});

    window.bwe = { "backend-url": mockUrl };
    await initialize();

    const store = getState(ELEMENTS.STORE);
    expect(store).toBeDefined();

    const connection = getState(ELEMENTS.BACKEND_CONNECTION);
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
