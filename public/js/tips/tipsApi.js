import { requestJson } from "../shared/apiClient.js";

const TIPS_PATH = "/api/tips";

// An empty processFilter means every process.
export function fetchTips(processFilter) {
  const query = processFilter
    ? `?${new URLSearchParams({ process: processFilter })}`
    : "";
  return requestJson(`${TIPS_PATH}${query}`);
}

export function createTip(fields) {
  return requestJson(TIPS_PATH, { method: "POST", body: fields });
}

export function updateTip(tipId, fields) {
  return requestJson(`${TIPS_PATH}/${tipId}`, {
    method: "PATCH",
    body: fields,
  });
}

export function deleteTip(tipId) {
  return requestJson(`${TIPS_PATH}/${tipId}`, { method: "DELETE" });
}
