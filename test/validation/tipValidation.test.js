import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  validateNewTip,
  validateProcessFilter,
  validateTipChanges,
} from "../../validation/tipValidation.js";

describe("validateNewTip", () => {
  test("accepts a complete tip and trims its text", () => {
    const { fields, errors } = validateNewTip({
      process: "Taxes",
      title: "  File Form 8843 even with no income  ",
      body: "  I skipped it my first year.  ",
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(fields, {
      process: "Taxes",
      title: "File Form 8843 even with no income",
      body: "I skipped it my first year.",
    });
  });

  test("drops fields the client may not set", () => {
    const { fields, errors } = validateNewTip({
      process: "OPT",
      title: "Ask for your DSO recommendation early",
      body: "It takes longer than you think.",
      ownerId: "someone-else",
      _id: "abc",
      isMine: true,
    });
    assert.deepEqual(errors, []);
    for (const fieldName of ["ownerId", "_id", "isMine"]) {
      assert.equal(Object.hasOwn(fields, fieldName), false, fieldName);
    }
  });

  test("reports every missing or invalid field", () => {
    const { errors } = validateNewTip({ process: "Housing", title: "   " });
    assert.equal(errors.length, 3);
    assert.ok(errors.some((error) => error.startsWith("Process must be")));
    assert.ok(errors.some((error) => error.startsWith("Title must be")));
    assert.ok(errors.includes("Tip is required."));
  });

  test("rejects text over the length limits", () => {
    const { errors } = validateNewTip({
      process: "Visa",
      title: "x".repeat(121),
      body: "x".repeat(2001),
    });
    assert.equal(errors.length, 2);
  });

  test("accepts text exactly at the length limits", () => {
    const { errors } = validateNewTip({
      process: "Visa",
      title: "x".repeat(120),
      body: "x".repeat(2000),
    });
    assert.deepEqual(errors, []);
  });

  test("rejects a body that is not an object", () => {
    for (const body of [undefined, null, [], "text"]) {
      assert.deepEqual(validateNewTip(body).errors, [
        "Request body must be a JSON object.",
      ]);
    }
  });
});

describe("validateTipChanges", () => {
  test("accepts a single changed field", () => {
    assert.deepEqual(validateTipChanges({ title: " Updated title " }), {
      fields: { title: "Updated title" },
      errors: [],
    });
  });

  test("requires at least one known field", () => {
    const { errors } = validateTipChanges({ ownerId: "someone-else" });
    assert.equal(errors.length, 1);
    assert.match(errors[0], /^Provide at least one of/);
  });

  test("rejects emptying a required field", () => {
    const { errors } = validateTipChanges({ body: "   " });
    assert.equal(errors.length, 1);
  });
});

describe("validateProcessFilter", () => {
  test("treats a missing or empty filter as all processes", () => {
    for (const query of [{}, { process: "" }]) {
      assert.deepEqual(validateProcessFilter(query), {
        processFilter: null,
        errors: [],
      });
    }
  });

  test("accepts a known process", () => {
    assert.deepEqual(validateProcessFilter({ process: "STEM OPT" }), {
      processFilter: "STEM OPT",
      errors: [],
    });
  });

  test("rejects an unknown or repeated process", () => {
    for (const process of ["Housing", "opt", ["OPT", "Taxes"]]) {
      const { processFilter, errors } = validateProcessFilter({ process });
      assert.equal(processFilter, null);
      assert.equal(errors.length, 1);
    }
  });
});
