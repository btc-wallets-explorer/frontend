export class TestUtils {
  /**
   * Renders a given element with provided attributes
   * and returns a promise which resolves as soon as
   * rendered element becomes available.
   * @param {string} tag
   * @param {object} attributes
   * @returns {Promise<HTMLElement>}
   */
  static render(tag, attributes = {}) {
    TestUtils.renderToDocument(tag, attributes);
    return TestUtils.waitForComponentToRender(tag);
  }

  /**
   * Replaces document's body with provided element
   * including given attributes.
   * @param {string} tag
   * @param {object} attributes
   */
  static renderToDocument(tag, attributes) {
    const htmlAttributes = TestUtils.mapObjectToHTMLAttributes(attributes);
    document.body.innerHTML = `<${tag} ${htmlAttributes}></${tag}>`;
  }

  /**
   * Converts an object to HTML string representation of attributes.
   *
   * For example: `{ foo: "bar", baz: "foo" }`
   * becomes `foo="bar" baz="foo"`
   *
   * @param {object} attributes
   * @returns {string}
   */
  static mapObjectToHTMLAttributes(attributes) {
    return Object.entries(attributes).reduce(
      (previous, current) => `${previous} ${current[0]}="${current[1]}"`,
      "",
    );
  }

  /**
   * Returns a promise which resolves as soon as
   * requested element becomes available.
   * @param {string} tag
   * @returns {Promise<HTMLElement>}
   */
  static async waitForComponentToRender(tag) {
    return new Promise((resolve) => {
      function requestComponent() {
        const element = document.querySelector(tag);
        if (element) {
          resolve(element);
        } else {
          window.requestAnimationFrame(requestComponent);
        }
      }
      requestComponent();
    });
  }

  static async timeout(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
