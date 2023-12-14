import { createNewStore } from "../../../../src/model/store";
import {
  VIEWING_MODES,
  setViewingMode,
} from "../../../../src/model/ui.reducer";
import { addWallets } from "../../../../src/model/wallets.reducer";
import { ELEMENTS, injectState, resetState } from "../../../../src/state";
import { registerWebComponents } from "../../../../src/ui";
import { Kegebd } from "../../../../src/ui/widgets/legend";
import { TestUtils } from "../../../test-utils";

describe("Legend", () => {
  let store;
  let element;

  beforeAll(async () => {
    registerWebComponents();
  });

  beforeEach(async () => {
    resetState();
    store = createNewStore();
    injectState(ELEMENTS.STORE, store);

    element = await TestUtils.render(Kegebd.tag);
  });

  it("shows the legend", async () => {});

  it("does not show force properties in overview mode", async () => {
    store.dispatch(
      addWallets([{ name: "w1" }, { name: "w2" }, { name: "w3" }]),
    );
    await TestUtils.timeout();

    const entries = Array.from(element.shadowRoot.querySelectorAll(".entry"));
    expect(entries).toHaveSize(3);

    const names = Array.from(element.shadowRoot.querySelectorAll(".label")).map(
      (e) => e.innerText,
    );
    expect(names).toEqual(["w1", "w2", "w3"]);

    const colors = Array.from(element.shadowRoot.querySelectorAll(".color"));
    expect(colors[0].style.getPropertyValue("background-color")).toEqual(
      "rgb(31, 119, 180)",
    );
    expect(colors[1].style.getPropertyValue("background-color")).toEqual(
      "rgb(255, 127, 14)",
    );
    expect(colors[2].style.getPropertyValue("background-color")).toEqual(
      "rgb(44, 160, 44)",
    );
  });
});
