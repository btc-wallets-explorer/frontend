import { blockchainReducer, setBlockchain } from '../../../src/store/blockchain.reducer';
import store from '../../../src/store/store';

describe('blockchain reducer', () => {
  console.log(blockchainReducer.getInitialState());

  it('has empty initial values', () => {
    expect(store.getState().blockchain).toEqual({
      transactions: {},
      scriptHashes: {},
      utxos: {},
    });
  });

  fit('sets the model', () => {
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
