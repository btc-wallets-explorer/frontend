import { ELEMENTS, getState, injectState } from '../../src/state';

describe('State', () => {
  it('exports state elements', () => {
    expect(ELEMENTS).toEqual({
      STORE: 'store',
      BACKEND_CONNECTION: 'backend-connection',
    });
  });

  it('injecting/getting state works as expected', () => {
    expect(() => {
      getState('does-not-exist');
    }).toThrowError("'does-not-exist' is not known.");

    expect(() => {
      getState(ELEMENTS.STORE);
    }).toThrowError("'store' is not injected yet.");

    expect(() => {
      injectState('does-not-exist', {});
    }).toThrowError("'does-not-exist' is not known.");

    // inject / getState;
    const expected = { test: true };
    injectState(ELEMENTS.STORE, expected);
    expect(getState(ELEMENTS.STORE)).toBe(expected);

    // inject again
    expect(() => {
      injectState(ELEMENTS.STORE, {});
    }).toThrowError("'store' was already injected.");
  });
});
