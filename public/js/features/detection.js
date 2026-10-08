import { FEATURE_NAMES } from "../data/factors.js";
import { state } from "../state/appState.js";
import { callExplanation } from "../services/apiClient.js";
import { $, } from "../utils/dom.js";
import { go } from "./screens.js";
import { renderResults } from "./results.js";

export function createPayload(ids) {
  const payload = {};

  FEATURE_NAMES.forEach(feature => {
    payload[feature] =
      ids.includes(feature)
        ? "yes"
        : "no";
  });

  return payload;
}

export async function detect() {
  if (state.selected.size < 5) {
    $("err").textContent =
      "Please select at least 5 factors before detecting.";

    $("err").hidden = false;
    return;
  }

  $("err").hidden = true;
  go("loading");

  try {
    const ids = Array.from(state.selected);
    const explanationData =
      await callExplanation(
        createPayload(ids)
      );

    renderResults(explanationData);
    go("results");
  } catch (error) {
    console.error(
      "Detection error:",
      error
    );

    go("select");

    $("err").textContent =
      error.message ||
      "The detector could not be reached. Please try again.";

    $("err").hidden = false;
  }
}
