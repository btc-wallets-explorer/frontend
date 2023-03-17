import { createNewStore } from '../../../src/model/store';
import {
  ELEMENTS, injectState, resetState,
} from '../../../src/state';
import { registerWebComponents } from '../../../src/ui';
import { App } from '../../../src/ui/app';
import { TestUtils } from '../../test-utils';

describe('App Element', () => {
  let store;
  let element;

  beforeAll(async () => {
    registerWebComponents();
  });

  beforeEach(async () => {
    resetState();
    store = createNewStore();
    injectState(ELEMENTS.STORE, store);

    element = await TestUtils.render(App.tag);
  });

  it('renders components', async () => {
    expect(element.shadowRoot.querySelectorAll('.page > .graph-view > *').length).toBe(2);
    expect(element.shadowRoot.querySelectorAll('.page > .graph-view > overview-mode')).toBeTruthy();
  });
});
