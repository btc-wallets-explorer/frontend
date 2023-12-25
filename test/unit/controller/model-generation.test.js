import { createNewStore } from "../../../src/model/store/store";
import { generateModel } from "../../../src/modules/model-generation";
import basicTestData from "../../test-data/basic-test-data";
import { createApiMock } from "../../test-helpers";

describe("model generation", () => {
  it("createAddresses returns addresses for a wallet", async () => {
    const store = createNewStore();

    const api = createApiMock(basicTestData);
    const wallets = await api.getWallets();

    const actual = await generateModel(store, api, wallets);

    expect(actual.transactions).toEqual(basicTestData.blockchain.transactions);
    expect(actual.utxos).toEqual(basicTestData.blockchain.utxos);
    expect(actual.scriptHashes).toEqual(
      Object.fromEntries(
        Object.values(basicTestData.blockchain.scriptHashes)
          .map((e) => ({
            ...e,
            info: basicTestData.usedAddresses.find(
              (a) => a.scriptHash === e.scriptHash,
            ),
          }))
          .map((e) => [e.scriptHash, e]),
      ),
    );
  });
});
