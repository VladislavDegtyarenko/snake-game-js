/**
 * Creates a DOM element with optional class, text, attributes, and events.
 *
 * @param {string} tag - The HTML tag name (e.g., "div", "button", "img").
 * @param {Object} [options] - Optional configuration.
 * @param {string|string[]} [options.className] - One or more CSS class names.
 * @param {string} [options.html] - Sets the element's innerHtml.
 * @param {string} [options.text] - Sets the element's textContent.
 * @param {Object} [options.attrs] - Key-value pairs of attributes (e.g., id, src).
 * @param {Object} [options.on] - Event listeners (e.g., { click: handler }).
 * @returns {HTMLElement} The created DOM element.
 *
 * @example
 * const btn = createElement("button", {
 *   className: ["btn", "btn--green"],
 *   text: "Start",
 *   attrs: { id: "startBtn" },
 *   on: { click: () => alert("Started!") }
 * });
 */
export function createElement(tag, { className, html, text, attrs, on } = {}) {
  const el = document.createElement(tag);

  if (className) {
    const classes = Array.isArray(className) ? className : [className];
    el.classList.add(...classes);
  }

  if (html) el.innerHTML = html;
  else if (text) el.textContent = text;

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }

  if (on) {
    for (const [event, handler] of Object.entries(on)) {
      el.addEventListener(event, handler);
    }
  }

  return el;
}
