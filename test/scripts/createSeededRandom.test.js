import assert from "node:assert/strict";
import { test } from "node:test";
import { createSeededRandom } from "../../scripts/createSeededRandom.js";

const takeValues = (random, count) => Array.from({ length: count }, random);

test("the same seed always produces the same sequence", () => {
  assert.deepEqual(
    takeValues(createSeededRandom(42), 5),
    takeValues(createSeededRandom(42), 5),
  );
});

test("different seeds produce different sequences", () => {
  assert.notDeepEqual(
    takeValues(createSeededRandom(1), 5),
    takeValues(createSeededRandom(2), 5),
  );
});

test("values stay in [0, 1)", () => {
  for (const value of takeValues(createSeededRandom(7), 10_000)) {
    assert.ok(value >= 0 && value < 1, `out of range: ${value}`);
  }
});
