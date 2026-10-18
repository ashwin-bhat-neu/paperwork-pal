import { ObjectId } from "mongodb";

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;

export function parseObjectId(text) {
  return OBJECT_ID_PATTERN.test(text) ? new ObjectId(text) : null;
}
