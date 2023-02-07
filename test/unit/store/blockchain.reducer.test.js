import { setBlockchain } from '../../../src/model/blockchain.reducer';
import { createNewStore } from '../../../src/model/store';

describe('blockchain reducer', () => {
  let store;
  beforeEach(() => {
    store = createNewStore();
  });

  it('has empty initial values', () => {
    expect(store.getState().blockchain).toEqual({
      transactions: {},
      scriptHashes: {},
      utxos: {},
    });
  });

  it('sets the model', () => {
    const expected = {
      transactions: { tx1: { txid: 'tx1' } },
      scriptHashes: { sh1: { scriptHash: 'sh1' } },
      utxos: { sh1: { scriptHash: 'sh1', utxos: [] } },
    };

    store.dispatch(setBlockchain(expected));

    const actual = store.getState().blockchain;
    expect(actual).toEqual(expected);
  });
});
