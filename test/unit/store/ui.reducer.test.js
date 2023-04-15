import { createNewStore } from '../../../src/model/store';
import {
  VIEWING_MODES,
  addSelection, clearSelections, removeSelection, sendNotification, setViewingMode,
} from '../../../src/model/ui.reducer';

describe('ui reducer', () => {
  let store;
  beforeEach(() => {
    store = createNewStore();
  });

  it('has empty initial values', () => {
    expect(store.getState().ui).toEqual({
      mode: 'overview',
      notifications: [],
      selections: [],
      forceStrength: {
        charge: 0.1,
        link: 0.1,
        collide: 1,
        x: 0.1,
        y: 0.1,
      },
    });
  });

  it('sends notification', () => {
    const expected = { title: 'blubber', content: 'content' };
    store.dispatch(sendNotification(expected));
    store.dispatch(sendNotification(expected));

    const actual = store.getState().ui;
    expect(actual.notifications).toEqual([expected, expected]);
  });

  it('adds selections', () => {
    const selection1 = { type: 'txo', id: 'test1' };
    const selection2 = { type: 'txo', id: 'test2' };

    store.dispatch(addSelection(selection1));
    store.dispatch(addSelection(selection2));

    const actual = store.getState().ui;
    expect(actual.selections).toEqual([selection1, selection2]);
  });

  it('removes a selection', () => {
    const selection1 = { type: 'txo', id: 'test1' };
    const selection2 = { type: 'txo', id: 'test2' };
    store.dispatch(addSelection(selection1));
    store.dispatch(addSelection(selection2));

    store.dispatch(removeSelection(selection1));

    const actual = store.getState().ui;
    expect(actual.selections).toEqual([selection2]);
  });

  it('clears selections', () => {
    const selection1 = { type: 'txo', id: 'test1' };
    const selection2 = { type: 'txo', id: 'test2' };
    store.dispatch(addSelection(selection1));
    store.dispatch(addSelection(selection2));

    store.dispatch(clearSelections());

    const actual = store.getState().ui;
    expect(actual.selections).toEqual([]);
  });

  it('sets the viewing mode', () => {
    store.dispatch(setViewingMode(VIEWING_MODES.DETAIL));

    expect(store.getState().ui.mode).toEqual(VIEWING_MODES.DETAIL);
  });
});
