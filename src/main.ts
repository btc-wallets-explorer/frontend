import { createNewStore } from "./model/store/store";
import { States, injectState } from "./state";
import { registerWebComponents } from "./view";
import { createConnection } from "./api";

const initialize = async () => {
  const store = createNewStore();
  injectState(States.STORE, store);

  console.log("Connecting to ", window["bwe"]["backend-url"]);
  const connection = await createConnection(window["bwe"]["backend-url"]);
  injectState(States.API, connection);

  registerWebComponents();
};

initialize();
