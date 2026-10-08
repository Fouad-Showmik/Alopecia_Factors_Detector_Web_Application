import { $ } from "../utils/dom.js";
import { state } from "../state/appState.js";
import { startStatus } from "./loading.js";

const SCREENS = [
  "intro",
  "select",
  "loading",
  "results"
];

export function go(name) {
  SCREENS.forEach(screen => {
    $(screen).hidden = screen !== name;
  });

  clearInterval(state.statusTimer);
  state.statusTimer = null;

  window.scrollTo(0, 0);

  const target = {
    intro: null,
    select: "selTitle",
    loading: "status",
    results: "resTitle"
  }[name];

  if (target) {
    $(target).focus({
      preventScroll: true
    });
  }

  if (name === "loading") {
    startStatus();
  }
}
