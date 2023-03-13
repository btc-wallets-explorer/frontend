import { createConnection } from '../../src/modules/api';

describe('when connection exists', () => {
  const setup = async () => createConnection('ws://localhost:8080');

  describe('transactions', () => {
    it('fetches transactions by txId', async () => {
      const api = await setup();

      const actual = await api.getTransactions([
        'efffda472426afbba15099c43d25caa8e58693367319bbe1fbd8e86cefcc6718',
        '93955d40d918d014903843d258aada5c720a5d37afac7889268f459a97b148a3',
      ]);
      expect(actual.map((r) => r.hash)).toEqual([
        '291745c0651694b80df3d7f3b2b3414103dcceb21bb61f969b8adc0d69ac8442',
        '4fdd8ead6e26754e87f02840a1688710e4be27954b9ac56a281dedf1e88e5467',
      ]);
    });
  });
});
