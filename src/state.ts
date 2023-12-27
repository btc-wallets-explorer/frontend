export const States = Object.freeze({
  STORE: "store",
  API: "backend-connection",
});

const stateObjects = {};

export const getState = (name) => {
  if (!Object.values(States).includes(name)) {
    throw new Error(`'${name}' is not known.`);
  }

  if (!Object.keys(stateObjects).includes(name)) {
    throw new Error(`'${name}' is not injected yet.`);
  }

  return stateObjects[name];
};

export const injectState = (name, value) => {
  if (!Object.values(States).includes(name)) {
    throw new Error(`'${name}' is not known.`);
  }

  if (Object.keys(stateObjects).includes(name)) {
    throw new Error(`'${name}' was already injected.`);
  }

  stateObjects[name] = value;
};

export const resetState = () => {
  Object.keys(stateObjects).forEach((key) => delete stateObjects[key]);
};
