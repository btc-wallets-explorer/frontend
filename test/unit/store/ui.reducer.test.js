import { createNewStore } from '../../../src/model/store';
import { sendNotification } from '../../../src/model/ui.reducer';

describe('ui reducer', () => {
  let store;
  beforeEach(() => {
    store = createNewStore();
  });

  it('has empty initial values', () => {
    expect(store.getState().ui).toEqual({
      notifications: [],
      forceStrength: {
        charge: 0.1,
        link: 0.1,
        collide: 0.1,
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
});
