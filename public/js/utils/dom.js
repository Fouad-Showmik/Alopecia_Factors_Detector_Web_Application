export const $ = id => document.getElementById(id);

export const NS = "http://www.w3.org/2000/svg";

export function h(tag, attrs = {}, kids = []) {
  const element = document.createElement(tag);

  for (const key in attrs) {
    if (key === "text") {
      element.textContent = attrs[key];
    } else if (key === "class") {
      element.className = attrs[key];
    } else {
      element.setAttribute(key, attrs[key]);
    }
  }

  kids.forEach(child => element.appendChild(child));

  return element;
}

export function s(tag, attrs = {}) {
  const element = document.createElementNS(NS, tag);

  for (const key in attrs) {
    element.setAttribute(key, attrs[key]);
  }

  return element;
}
