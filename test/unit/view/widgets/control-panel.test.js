import { createNewStore } from "../../../../src/model/store/store";
import {
  VIEWING_MODES,
  setViewingMode,
} from "../../../../src/model/store/ui.reducer";
import { ELEMENTS, injectState, resetState } from "../../../../src/state";
import { registerWebComponents } from "../../../../src/view";
import { ControlPanel } from "../../../../src/view/widgets/control-panel";
import { TestUtils } from "../../../test-utils";

describe("Control Panel", () => {
  let store;
  let element;

  beforeAll(async () => {
    registerWebComponents();
  });

  beforeEach(async () => {
    resetState();
    store = createNewStore();
    injectState(ELEMENTS.STORE, store);

    element = await TestUtils.render(ControlPanel.tag);
  });

  it("toggles between detail and overview mode", async () => {
    const modeToggle = element.shadowRoot.querySelector("#toggle-mode");
    expect(modeToggle.checked).toBeFalse();
    expect(store.getState().ui.mode).toEqual("overview");

    modeToggle.click();
    expect(store.getState().ui.mode).toEqual(VIEWING_MODES.DETAIL);

    modeToggle.click();
    expect(store.getState().ui.mode).toEqual(VIEWING_MODES.OVERVIEW);
  });

  it("does not show force properties in overview mode", async () => {
    store.dispatch(setViewingMode(VIEWING_MODES.DETAIL));
    await TestUtils.timeout();
    expect(element.shadowRoot.querySelector(".force-control")).not.toHaveClass(
      "disabled",
    );

    store.dispatch(setViewingMode(VIEWING_MODES.OVERVIEW));
    await TestUtils.timeout();
    expect(element.shadowRoot.querySelector(".force-control")).toHaveClass(
      "disabled",
    );
  });
});
