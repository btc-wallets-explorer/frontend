import generateModel from '../../src/model-generation';
import * as api from '../../src/api';

describe('Integration: model generation', () => {
  it('creates model', async () => {
    spyOn(api, 'getTransactions').and.returnValue('blubber');
    const connection = {};
    const wallets = [

    ];

    const model = generateModel(connection, wallets);

    expect(model).toEqual({});
  });
});
