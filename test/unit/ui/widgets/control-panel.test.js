import { createNewStore } from '../../../../src/model/store';
import { setViewingMode } from '../../../../src/model/ui.reducer';
import {
  ELEMENTS, injectState, resetState,
} from '../../../../src/state';
import { registerWebComponents } from '../../../../src/ui';
import { ControlPanel } from '../../../../src/ui/components/widgets/control-panel';
import { TestUtils } from '../../../test-utils';

describe('Control Panel', () => {
  let store;
  let element;

  beforeAll(async () => {
    registerWebComponents();
  });

  beforeEach(async () => {
    resetState();
    store = createNewStore();
    injectState(ELEMENTS.STORE, store);

    element = await TestUtils.render(ControlPanel.tag);
  });

  it('toggles between detail and overview mode', async () => {
    const modeToggle = element.shadowRoot.querySelector('#toggle-mode');
    expect(modeToggle.checked).toBeFalse();
    expect(store.getState().ui.mode).toEqual('overview');

    modeToggle.click();
    expect(store.getState().ui.mode).toEqual('detail');

    modeToggle.click();
    expect(store.getState().ui.mode).toEqual('overview');
  });

  it('does not show force properties in overview mode', async () => {
    store.dispatch(setViewingMode('detail'));
    await TestUtils.timeout();
    expect(element.shadowRoot.querySelector('.force-control')).not.toHaveClass('disabled');

    store.dispatch(setViewingMode('overview'));
    await TestUtils.timeout();
    expect(element.shadowRoot.querySelector('.force-control')).toHaveClass('disabled');
  });
});
