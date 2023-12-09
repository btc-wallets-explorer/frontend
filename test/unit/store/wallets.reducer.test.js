import { createNewStore } from "../../../src/model/store";
import {
  addWallets,
  clearWallets,
  removeWallets,
} from "../../../src/model/wallets.reducer";

describe("wallets reducer", () => {
  let store;
  beforeEach(() => {
    store = createNewStore();
  });

  it("has empty initial values", () => {
    expect(store.getState().wallets).toEqual([]);
  });

  const wallet1 = { name: "name", xpub: "xpub", type: "type" };
  const wallet2 = { name: "name2", xpub: "xpub2", type: "type2" };

  it("adds wallets", () => {
    store.dispatch(addWallets([wallet1, wallet2]));

    const actual = store.getState().wallets;
    expect(actual).toEqual([wallet1, wallet2]);
  });

  it("removes a wallet", () => {
    store.dispatch(addWallets([wallet1, wallet2]));
    store.dispatch(removeWallets([wallet1.name]));

    const actual = store.getState().wallets;
    expect(actual).toEqual([wallet2]);
  });

  it("clears all wallets", () => {
    store.dispatch(addWallets([wallet1, wallet2]));
    store.dispatch(clearWallets());

    const actual = store.getState().wallets;
    expect(actual).toEqual([]);
  });
});
