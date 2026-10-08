import { state } from "./state/appState.js";
import { $ } from "./utils/dom.js";
import { buildIntro } from "./features/intro.js";
import {
  buildFactors,
  syncCards,
  updateBar
} from "./features/factorSelection.js";
import { buildNet } from "./features/loading.js";
import { detect } from "./features/detection.js";
import { go } from "./features/screens.js";

buildIntro();
buildFactors();
buildNet();
updateBar();

$("beginBtn").addEventListener(
  "click",
  () => go("select")
);

$("clearBtn").addEventListener(
  "click",
  () => {
    state.selected.clear();
    syncCards();
  }
);

$("detectBtn").addEventListener(
  "click",
  detect
);

$("editBtn").addEventListener(
  "click",
  () => go("select")
);

$("restartBtn").addEventListener(
  "click",
  () => {
    state.selected.clear();
    syncCards();
    go("select");
  }
);

if (state.reducedMotion) {
  go("select");
}
