import { createNewStore } from './model/store';
import { ELEMENTS, injectState } from './state';
import { registerWebComponents } from './ui';

const store = createNewStore();
injectState(ELEMENTS.STORE, store);

registerWebComponents();
