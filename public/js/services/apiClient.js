import { API_ENDPOINTS } from "../config/api.js";

async function postJson(endpoint, payload) {
  const response = await fetch(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid response."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      `Request failed: ${response.status}`
    );
  }

  return data;
}

export function callPrediction(payload) {
  return postJson(
    API_ENDPOINTS.prediction,
    payload
  );
}

export function callExplanation(payload) {
  return postJson(
    API_ENDPOINTS.explanation,
    payload
  );
}
