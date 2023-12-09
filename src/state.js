const ELEMENTS = Object.freeze({
  STORE: "store",
  BACKEND_CONNECTION: "backend-connection",
});

const stateObjects = {};

const getState = (name) => {
  if (!Object.values(ELEMENTS).includes(name)) {
    throw new Error(`'${name}' is not known.`);
  }

  if (!Object.keys(stateObjects).includes(name)) {
    throw new Error(`'${name}' is not injected yet.`);
  }

  return stateObjects[name];
};

const injectState = (name, value) => {
  if (!Object.values(ELEMENTS).includes(name)) {
    throw new Error(`'${name}' is not known.`);
  }

  if (Object.keys(stateObjects).includes(name)) {
    throw new Error(`'${name}' was already injected.`);
  }

  stateObjects[name] = value;
};
const resetState = () => {
  Object.keys(stateObjects).forEach((key) => delete stateObjects[key]);
};

module.exports = {
  ELEMENTS,
  getState,
  injectState,
  resetState,
};
