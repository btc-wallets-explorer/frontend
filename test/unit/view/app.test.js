import { createNewStore } from "../../../src/model/store/store";
import {
  VIEWING_MODES,
  setViewingMode,
} from "../../../src/model/store/ui.reducer";
import { States, injectState, resetState } from "../../../src/state";
import { registerWebComponents } from "../../../src/view";
import { App } from "../../../src/view/app";
import { TestUtils } from "../../test-utils";

describe("App Element", () => {
  let store;
  let connection;
  let element;

  beforeAll(async () => {
    registerWebComponents();
  });

  beforeEach(async () => {
    resetState();
    store = createNewStore();
    injectState(States.STORE, store);

    connection = {
      getSettings: () => {},
      getWallets: () => [],
      getTransactions: () => [],
      getUTXOs: () => [],
    };
    injectState(States.API, connection);

    element = await TestUtils.render(App.tag);
  });

  it("renders components", async () => {
    expect(
      element.shadowRoot.querySelectorAll(".page > .graph-view > *").length,
    ).toBe(3);
  });

  it('renders detail mode if "ui.mode === detail"', async () => {
    const overviewTag = element.shadowRoot.querySelector("overview-graph");
    const detailTag = element.shadowRoot.querySelector("detailed-graph");

    expect(overviewTag.style.display).toEqual("block");
    expect(detailTag.style.display).toEqual("none");

    store.dispatch(setViewingMode(VIEWING_MODES.DETAIL));
    await TestUtils.timeout();
    expect(overviewTag.style.display).toEqual("none");
    expect(detailTag.style.display).toEqual("block");
  });
});
