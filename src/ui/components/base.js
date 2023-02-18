import { LitElement } from 'lit';
import baseCss from './base.css';

export class Base extends LitElement {
  static css = baseCss;

  static properties = {
    store: {},
  };
}
