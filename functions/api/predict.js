const ENDPOINT = "predict";

const MAX_BODY_BYTES = 10 * 1024;
const UPSTREAM_TIMEOUT_MS = 90 * 1000;

function sendJson(status, data, headers = {}) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        ...headers
      }
    }
  );
}

export async function onRequestPost(context) {
  const apiBaseUrl =
    (context.env.API_BASE_URL || "")
      .replace(/\/+$/, "");

  if (!apiBaseUrl) {
    console.error("API_BASE_URL is not configured.");

    return sendJson(500, {
      error: "The analysis service is not configured."
    });
  }

  const contentLength = Number(
    context.request.headers.get("content-length") || 0
  );

  if (contentLength > MAX_BODY_BYTES) {
    return sendJson(413, {
      error: "Request is too large."
    });
  }

  let body;

  try {
    body = await context.request.text();
  } catch {
    return sendJson(400, {
      error: "Unable to read request body."
    });
  }

  if (
    new TextEncoder().encode(body).byteLength >
    MAX_BODY_BYTES
  ) {
    return sendJson(413, {
      error: "Request is too large."
    });
  }

  try {
    JSON.parse(body);
  } catch {
    return sendJson(400, {
      error: "Request body must be valid JSON."
    });
  }

  const headers = {
    "Content-Type": "application/json"
  };

  if (context.env.API_KEY) {
    headers["X-API-Key"] = context.env.API_KEY;
  }

  try {
    const upstream = await fetch(
      `${apiBaseUrl}/${ENDPOINT}`,
      {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(
          UPSTREAM_TIMEOUT_MS
        )
      }
    );

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      upstream.headers.get("content-type") ||
        "application/json"
    );
    responseHeaders.set(
      "Cache-Control",
      "no-store"
    );

    return new Response(
      upstream.body,
      {
        status: upstream.status,
        headers: responseHeaders
      }
    );
  } catch (error) {
    console.error(
      "Upstream request failed:",
      error?.name || "UnknownError"
    );

    return sendJson(502, {
      error:
        "The analysis service is unavailable. Please try again."
    });
  }
}
