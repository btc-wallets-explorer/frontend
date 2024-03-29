import { States, getState, injectState } from "../../src/state";

describe("State", () => {
  it("exports state elements", () => {
    expect(States).toEqual({
      STORE: "store",
      API: "backend-connection",
    });
  });

  it("injecting/getting state works as expected", () => {
    expect(() => {
      getState("does-not-exist");
    }).toThrowError("'does-not-exist' is not known.");

    expect(() => {
      getState(States.STORE);
    }).toThrowError("'store' is not injected yet.");

    expect(() => {
      injectState("does-not-exist", {});
    }).toThrowError("'does-not-exist' is not known.");

    // inject / getState;
    const expected = { test: true };
    injectState(States.STORE, expected);
    expect(getState(States.STORE)).toBe(expected);

    // inject again
    expect(() => {
      injectState(States.STORE, {});
    }).toThrowError("'store' was already injected.");
  });
});
