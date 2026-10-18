import { getOwnerId } from "./ownerId.js";

const NO_CONTENT_STATUS = 204;

export async function requestJson(path, { method = "GET", body } = {}) {
  const headers = { "X-Owner-Id": getOwnerId() };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection.");
  }

  if (response.status === NO_CONTENT_STATUS) {
    return null;
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error ?? `Request failed (${response.status}).`);
  }
  return payload;
}
