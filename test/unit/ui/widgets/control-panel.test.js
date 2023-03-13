import { createNewStore } from '../../../../src/model/store';
import { ELEMENTS, injectState } from '../../../../src/state';
import { ControlPanel } from '../../../../src/ui/components/widgets/control-panel';
import { TestUtils } from '../../../test-utils';

describe('Control Panel', () => {
  const setup = async () => {
    const store = createNewStore();
    injectState(ELEMENTS.STORE, store);

    return TestUtils.render(ControlPanel.tag, { store });
  };

  it('toggles between detail and overview mode', async () => {
    const element = await setup();
    const modeToggle = element.querySelector('#modeToggle');
    modeToggle.click();
  });
});
