import { createNewStore, observe } from '../../../src/model/store';
import { sendNotification } from '../../../src/model/ui.reducer';
import { addWallets } from '../../../src/model/wallets.reducer';
import { timeout } from '../../test-helpers';

describe('store test', () => {
  it('observes a part of the store', async () => {
    const store = createNewStore();

    let walletsCalback = 0;
    observe(store, 'wallets', () => { walletsCalback += 1; });

    store.dispatch(addWallets([{ name: 'test1' }]));
    store.dispatch(addWallets([{ name: 'test1' }]));
    store.dispatch(sendNotification({ title: 'title', content: 'content' }));

    await timeout(50);

    expect(walletsCalback).toBe(2);
  });
});
