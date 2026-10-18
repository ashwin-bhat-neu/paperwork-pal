import { requestJson } from "../shared/apiClient.js";

const DEADLINES_PATH = "/api/deadlines";

export function fetchDeadlines() {
  return requestJson(DEADLINES_PATH);
}

export function createDeadline(fields) {
  return requestJson(DEADLINES_PATH, { method: "POST", body: fields });
}

export function updateDeadline(deadlineId, fields) {
  return requestJson(`${DEADLINES_PATH}/${deadlineId}`, {
    method: "PATCH",
    body: fields,
  });
}

export function deleteDeadline(deadlineId) {
  return requestJson(`${DEADLINES_PATH}/${deadlineId}`, { method: "DELETE" });
}
