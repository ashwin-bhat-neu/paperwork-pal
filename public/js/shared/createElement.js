// Sets text through textContent so user-entered text is never parsed as HTML.
export function createElement(tagName, className = "", textContent = "") {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = textContent;
  return element;
}
