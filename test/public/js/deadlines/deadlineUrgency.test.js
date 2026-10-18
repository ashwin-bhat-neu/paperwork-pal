import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  calculateDaysRemaining,
  classifyUrgency,
  countUrgentDeadlines,
  describeDaysRemaining,
  formatDueDate,
  formatLocalDateAsIso,
} from "../../../../public/js/deadlines/deadlineUrgency.js";

const TODAY_ISO = "2026-10-17";

describe("calculateDaysRemaining", () => {
  test("counts calendar days in both directions", () => {
    assert.equal(calculateDaysRemaining("2026-10-22", TODAY_ISO), 5);
    assert.equal(calculateDaysRemaining("2026-10-17", TODAY_ISO), 0);
    assert.equal(calculateDaysRemaining("2026-10-14", TODAY_ISO), -3);
  });

  test("stays exact across daylight saving changes and leap years", () => {
    assert.equal(calculateDaysRemaining("2026-11-02", "2026-10-31"), 2);
    assert.equal(calculateDaysRemaining("2027-04-15", TODAY_ISO), 180);
    assert.equal(calculateDaysRemaining("2028-03-01", "2028-02-28"), 2);
  });
});

describe("describeDaysRemaining", () => {
  test("words late, today, and remaining days with correct plurals", () => {
    assert.equal(describeDaysRemaining(-3), "3 days late");
    assert.equal(describeDaysRemaining(-1), "1 day late");
    assert.equal(describeDaysRemaining(0), "Due today");
    assert.equal(describeDaysRemaining(1), "1 day left");
    assert.equal(describeDaysRemaining(180), "180 days left");
  });
});

describe("classifyUrgency", () => {
  const deadlineDue = (dueDate, status = "not started") => ({
    dueDate,
    status,
  });

  test("marks past, within-a-week, and later deadlines", () => {
    assert.equal(
      classifyUrgency(deadlineDue("2026-10-16"), TODAY_ISO),
      "overdue",
    );
    assert.equal(classifyUrgency(deadlineDue("2026-10-17"), TODAY_ISO), "soon");
    assert.equal(classifyUrgency(deadlineDue("2026-10-24"), TODAY_ISO), "soon");
    assert.equal(
      classifyUrgency(deadlineDue("2026-10-25"), TODAY_ISO),
      "later",
    );
  });

  test("treats submitted deadlines as done even when overdue", () => {
    const submitted = deadlineDue("2026-10-01", "submitted");
    assert.equal(classifyUrgency(submitted, TODAY_ISO), "submitted");
  });

  test("counts overdue and due-soon deadlines, ignoring submitted ones", () => {
    const deadlines = [
      deadlineDue("2026-10-14"),
      deadlineDue("2026-10-22", "in progress"),
      deadlineDue("2026-10-20", "submitted"),
      deadlineDue("2027-04-15"),
    ];
    assert.deepEqual(countUrgentDeadlines(deadlines, TODAY_ISO), {
      overdueCount: 1,
      dueSoonCount: 1,
    });
  });
});

describe("date formatting", () => {
  test("formats a due date without shifting the day", () => {
    assert.equal(formatDueDate("2026-10-22"), "Oct 22, 2026");
    assert.equal(formatDueDate("2027-01-01"), "Jan 1, 2027");
  });

  test("uses the local calendar date for today", () => {
    assert.equal(
      formatLocalDateAsIso(new Date(2026, 0, 5, 23, 59)),
      "2026-01-05",
    );
  });
});
