import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  isValidDueDate,
  validateDeadlineChanges,
  validateNewDeadline,
} from "../../validation/deadlineValidation.js";

describe("isValidDueDate", () => {
  test("accepts real calendar dates, including leap days", () => {
    assert.equal(isValidDueDate("2026-10-22"), true);
    assert.equal(isValidDueDate("2028-02-29"), true);
  });

  test("rejects impossible dates, wrong formats, and out-of-range years", () => {
    for (const value of [
      "2027-02-29",
      "2026-13-01",
      "2026-04-31",
      "2026-1-5",
      "10/22/2026",
      "0026-10-22",
      "2101-01-01",
      20261022,
      null,
    ]) {
      assert.equal(isValidDueDate(value), false, `expected ${value} invalid`);
    }
  });
});

describe("validateNewDeadline", () => {
  test("fills in default status and notes", () => {
    const { fields, errors } = validateNewDeadline({
      documentType: "Form 8843",
      dueDate: "2027-04-15",
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(fields, {
      documentType: "Form 8843",
      dueDate: "2027-04-15",
      status: "not started",
      notes: "",
    });
  });

  test("trims notes and drops fields the client may not set", () => {
    const { fields, errors } = validateNewDeadline({
      documentType: "OPT application",
      dueDate: "2026-10-14",
      notes: "  Need DSO recommendation first  ",
      ownerId: "someone-else",
      _id: "abc",
    });
    assert.deepEqual(errors, []);
    assert.equal(fields.notes, "Need DSO recommendation first");
    assert.equal(Object.hasOwn(fields, "ownerId"), false);
    assert.equal(Object.hasOwn(fields, "_id"), false);
  });

  test("reports every missing or invalid field", () => {
    const { errors } = validateNewDeadline({ status: "done", notes: 42 });
    assert.equal(errors.length, 4);
    assert.ok(errors.some((error) => error.startsWith("Status must be")));
    assert.ok(errors.some((error) => error.startsWith("Notes must be")));
    assert.ok(errors.includes("Document type is required."));
    assert.ok(errors.includes("Due date is required."));
  });

  test("rejects notes over the length limit", () => {
    const { errors } = validateNewDeadline({
      documentType: "Other",
      dueDate: "2026-12-01",
      notes: "x".repeat(501),
    });
    assert.equal(errors.length, 1);
  });

  test("rejects a body that is not an object", () => {
    for (const body of [undefined, null, [], "text"]) {
      assert.deepEqual(validateNewDeadline(body).errors, [
        "Request body must be a JSON object.",
      ]);
    }
  });
});

describe("validateDeadlineChanges", () => {
  test("accepts a status-only change without defaults", () => {
    assert.deepEqual(validateDeadlineChanges({ status: "submitted" }), {
      fields: { status: "submitted" },
      errors: [],
    });
  });

  test("requires at least one known field", () => {
    const { errors } = validateDeadlineChanges({ ownerId: "someone-else" });
    assert.equal(errors.length, 1);
    assert.match(errors[0], /^Provide at least one of/);
  });

  test("rejects an invalid due date", () => {
    const { errors } = validateDeadlineChanges({ dueDate: "2026-02-30" });
    assert.equal(errors.length, 1);
  });
});
