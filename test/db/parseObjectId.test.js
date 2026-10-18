import assert from "node:assert/strict";
import { test } from "node:test";
import { parseObjectId } from "../../db/parseObjectId.js";

test("parses a 24-character hex string", () => {
  const text = "6716b3f2a1c4e5d6f7a8b9c0";
  assert.equal(parseObjectId(text)?.toHexString(), text);
});

test("returns null for anything else", () => {
  for (const text of [
    "",
    "not-an-id",
    "6716b3f2a1c4e5d6f7a8b9c",
    "twelve chars",
  ]) {
    assert.equal(parseObjectId(text), null);
  }
});
