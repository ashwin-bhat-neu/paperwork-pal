const OWNER_ID_STORAGE_KEY = "paperworkPal.ownerId";

export function getOwnerId() {
  let ownerId = localStorage.getItem(OWNER_ID_STORAGE_KEY);
  if (!ownerId) {
    ownerId = crypto.randomUUID();
    localStorage.setItem(OWNER_ID_STORAGE_KEY, ownerId);
  }
  return ownerId;
}
