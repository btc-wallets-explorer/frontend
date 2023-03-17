import { Server } from 'mock-socket';
import { initialize } from '../../src/init';
import {
  ELEMENTS, getState,
} from '../../src/state';
import { App } from '../../src/ui/app';
import { DetailedGraph } from '../../src/ui/components/graphs/detailed/detailed-graph';
import { OverviewGraph } from '../../src/ui/components/graphs/overview/overview-graph';
import { ControlPanel } from '../../src/ui/components/widgets/control-panel';
import { Notifications } from '../../src/ui/components/widgets/notifications';
import { SelectionInfo } from '../../src/ui/components/widgets/selection-info';

describe('Main', () => {
  it('sets up the state and registers web components', async () => {
    const mockUrl = 'ws://localhost:9999';
    const mockServer = new Server(mockUrl);

    mockServer.on('connection', (socket) => {
      socket.on('message', (data) => {
        socket.send('test message from mock server');
      });
    });

    window.bwe = { 'backend-url': mockUrl };
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
      expect(new (window.customElements.get(component.tag))()).toEqual(new component());
    });
  });
});
