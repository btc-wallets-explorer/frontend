import { createNewStore } from '../../../../../src/model/store';
import { generateModel } from '../../../../../src/modules/model-generation';
import { toOverviewModel } from '../../../../../src/ui/graphs/overview/d3-overview-graph';
import basicTestData from '../../../../test-data/basic-test-data';
import { createApiMock } from '../../../../test-helpers';

describe('d3-overview-graph', () => {
  it('toOverviewModel creates model', async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    const wallets = await api.getWallets();
    const data = await generateModel(store, api, wallets);
    const model = toOverviewModel(data);

    expect(model.sort()).toEqual([
      { time: 50, tx: 'xx1', vin: 0 },
      { time: 50, tx: 'xx1', vin: 1 },
      { time: 50, tx: 'xx2', vin: 2 },
      { time: 300, tx: 'tx2', vout: 1 },
      { time: 300, tx: 'xx3', vin: 2 },
      { time: 430, tx: 'tx4', vout: 1 },
      {
        time: 50, wallet: 'w1', tx: 'tx1', vout: 0,
      },
      {
        time: 50, wallet: 'w1', tx: 'tx1', vout: 1,
      },
      {
        time: 300, wallet: 'w1', tx: 'tx2', vin: 1,
      },
      {
        time: 350, wallet: 'w1', tx: 'tx3', vin: 0,
      },
      {
        time: 50, wallet: 'w2', tx: 'tx1', vout: 2,
      },
      {
        time: 300, wallet: 'w2', tx: 'tx2', vout: 0,
      },
      {
        time: 350, wallet: 'w2', tx: 'tx3', vout: 0,
      },
      {
        time: 350, wallet: 'w2', tx: 'tx3', vin: 1,
      },
      {
        time: 430, wallet: 'w2', tx: 'tx4', vout: 0,
      },
      {
        time: 430, wallet: 'w2', tx: 'tx4', vin: 0,
      },
      {
        time: 430, wallet: 'w2', tx: 'tx4', vin: 1,
      },
    ].sort());
  });
});
