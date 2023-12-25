import { setSettings } from "../../../src/model/store/settings.reducer.";
import { createNewStore } from "../../../src/model/store/store";

describe("settings reducer", () => {
  let store;
  beforeEach(() => {
    store = createNewStore();
  });

  it("has empty initial values", () => {
    expect(store.getState().settings).toEqual({
      "block-explorer-url": "",
    });
  });

  it("sets the model", () => {
    const expected = {
      "blockexplorer-url": "https://mempool.info",
    };

    store.dispatch(setSettings(expected));

    const actual = store.getState().settings;
    expect(actual).toEqual(expected);
  });
});
