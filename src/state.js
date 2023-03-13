const ELEMENTS = Object.freeze({
  STORE: 'store',
});

const stateObjects = {
};

const getState = (name) => {
  if (!(Object.values(ELEMENTS).includes(name))) {
    throw new Error(`'${name}' is not known.`);
  }

  if (!(Object.keys(stateObjects).includes(name))) {
    throw new Error(`'${name}' is not injected yet.`);
  }

  return stateObjects[name];
};

const injectState = (name, value) => {
  if (!(Object.values(ELEMENTS).includes(name))) {
    throw new Error(`'${name}' is not known.`);
  }

  if ((Object.keys(stateObjects).includes(name))) {
    throw new Error(`'${name}' was already injected.`);
  }

  stateObjects[name] = value;
};

module.exports = { ELEMENTS, getState, injectState };
