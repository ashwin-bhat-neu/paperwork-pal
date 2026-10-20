import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "../../scripts/createSeededRandom.js";
import {
  generateSeedTips,
  SEED_AUTHOR_ID_PREFIX,
} from "../../scripts/generateSeedTips.js";
import {
  TIP_PROCESSES,
  validateNewTip,
} from "../../validation/tipValidation.js";

const NOW = new Date("2026-10-19T12:00:00Z");

function generate() {
  return generateSeedTips(createSeededRandom(20261019), NOW);
}

describe("generateSeedTips", () => {
  test("produces about 1,000 tips", () => {
    const tips = generate();
    assert.ok(tips.length >= 900 && tips.length <= 1100, `${tips.length}`);
  });

  test("produces the same tips from the same seed", () => {
    assert.deepEqual(generate(), generate());
  });

  test("produces only tips the API would accept", () => {
    for (const { process, title, body } of generate()) {
      const { fields, errors } = validateNewTip({ process, title, body });
      assert.deepEqual(errors, [], title);
      assert.deepEqual(fields, { process, title, body });
    }
  });

  test("covers every process", () => {
    const seededProcesses = new Set(generate().map((tip) => tip.process));
    assert.deepEqual([...seededProcesses].sort(), [...TIP_PROCESSES].sort());
  });

  test("gives every tip a seed author ID the API accepts", () => {
    for (const { ownerId } of generate()) {
      assert.ok(ownerId.startsWith(SEED_AUTHOR_ID_PREFIX));
      assert.match(ownerId, /^[A-Za-z0-9-]{8,64}$/);
    }
  });

  test("dates every tip in the past, with edits after posting", () => {
    const tips = generate();
    for (const { createdAt, updatedAt } of tips) {
      assert.ok(createdAt <= updatedAt);
      assert.ok(updatedAt <= NOW);
    }
    assert.ok(tips.some((tip) => tip.updatedAt > tip.createdAt));
  });
});
