import {
  loadBlockchain,
  loadSettings,
  loadWallets,
} from "../../../src/controller/fetch-data";
import { createNewStore } from "../../../src/model/store/store";
import basicTestData from "../../test-data/basic-test-data";
import { createApiMock } from "../../test-helpers";

describe("fetching data", () => {
  it("loadWallets", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);

    await store.dispatch(loadWallets(api));
    const actual = store.getState().wallets;

    expect(actual).toEqual(basicTestData.wallets);
  });

  it("loadSettings", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);

    await store.dispatch(loadSettings(api));
    const actual = store.getState().settings;

    expect(actual).toEqual(basicTestData.settings);
  });

  it("loadBlockchain", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    await store.dispatch(loadWallets(api));

    await store.dispatch(loadBlockchain(api));
    const actual = store.getState().blockchain;

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

  it("loadBlockchain sends loading notifications", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    await store.dispatch(loadWallets(api));

    await store.dispatch(loadBlockchain(api));
    const actual = store.getState().ui.notifications;

    expect(actual.length).toEqual(8);
    expect(actual[0]).toEqual({
      title: "fetching",
      content: " adresses for w1 - 0-50",
    });
  });
});
