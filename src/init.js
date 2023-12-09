import { createNewStore } from "./model/store";
import { ELEMENTS, injectState } from "./state";
import { registerWebComponents } from "./ui";
import { createConnection } from "./modules/api";

export const initialize = async () => {
  const store = createNewStore();
  injectState(ELEMENTS.STORE, store);

  console.log("Connecting to ", window.bwe["backend-url"]);
  const connection = await createConnection(window.bwe["backend-url"]);
  injectState(ELEMENTS.BACKEND_CONNECTION, connection);

  registerWebComponents();
};
