import assert from "node:assert/strict";
import { test } from "node:test";
import { createSeededRandom } from "../../scripts/createSeededRandom.js";
import {
  generateSeedDeadlines,
  SEED_OWNER_ID_PREFIX,
} from "../../scripts/generateSeedDeadlines.js";
import { validateNewDeadline } from "../../validation/deadlineValidation.js";

const TODAY_ISO = "2026-10-18";
const CREATED_AT = new Date("2026-10-18T12:00:00Z");
const generate = (seed) =>
  generateSeedDeadlines(createSeededRandom(seed), TODAY_ISO, CREATED_AT);

test("produces more than 1,000 deadlines across 200 seed owners", () => {
  const deadlines = generate(20261018);
  const ownerIds = new Set(deadlines.map((deadline) => deadline.ownerId));
  assert.ok(deadlines.length > 1000, `only ${deadlines.length} deadlines`);
  assert.equal(ownerIds.size, 200);
  for (const ownerId of ownerIds) {
    assert.ok(ownerId.startsWith(SEED_OWNER_ID_PREFIX));
  }
});

test("every deadline passes the same validation as the API", () => {
  for (const deadline of generate(20261018)) {
    const { ownerId, createdAt, updatedAt, ...fields } = deadline;
    const { errors } = validateNewDeadline(fields);
    assert.deepEqual(errors, [], JSON.stringify(deadline));
    assert.equal(createdAt, CREATED_AT);
    assert.equal(updatedAt, CREATED_AT);
    assert.match(ownerId, /^[A-Za-z0-9-]{8,64}$/);
  }
});

test("due dates fall between 30 days ago and a year from today", () => {
  const dueDates = generate(5).map((deadline) => deadline.dueDate);
  assert.ok(dueDates.every((dueDate) => dueDate >= "2026-09-18"));
  assert.ok(dueDates.every((dueDate) => dueDate <= "2027-10-18"));
});

test("the same seed gives identical data and a different seed does not", () => {
  assert.deepEqual(generate(99), generate(99));
  assert.notDeepEqual(generate(99), generate(100));
});
