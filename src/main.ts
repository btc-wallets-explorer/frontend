import { createNewStore } from "./model/store/store";
import { ELEMENTS, injectState } from "./state";
import { registerWebComponents } from "./view";
import { createConnection } from "./api";

const initialize = async () => {
  const store = createNewStore();
  injectState(ELEMENTS.STORE, store);

  console.log("Connecting to ", window["bwe"]["backend-url"]);
  const connection = await createConnection(window["bwe"]["backend-url"]);
  injectState(ELEMENTS.BACKEND_CONNECTION, connection);

  registerWebComponents();
};

initialize();
