import { DOCUMENT_TYPES } from "../validation/deadlineValidation.js";

export const SEED_OWNER_ID_PREFIX = "seed-owner-";
const SEED_OWNER_COUNT = 200;
// An average of six per owner gives about 1,200 deadlines.
const MINIMUM_DEADLINES_PER_OWNER = 3;
const MAXIMUM_DEADLINES_PER_OWNER = 9;
const EARLIEST_DUE_OFFSET_DAYS = -30;
const LATEST_DUE_OFFSET_DAYS = 365;
const PAST_DUE_SUBMITTED_PERCENT = 80;
const UPCOMING_SUBMITTED_PERCENT = 10;
const IN_PROGRESS_PERCENT = 30;
const SAMPLE_NOTES = [
  "",
  "",
  "Need DSO recommendation first",
  "Mail with the tax return",
  "Book the appointment early",
  "Waiting on the employer letter",
  "Update the address in the SEVP portal",
  "Ask the international student office",
  "Keep a copy of the receipt notice",
];

function pickInteger(random, minimum, maximum) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function pickItem(random, items) {
  return items[Math.floor(random() * items.length)];
}

function addDaysToIsoDate(isoDate, dayCount) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const shiftedDate = new Date(Date.UTC(year, month - 1, day + dayCount));
  return shiftedDate.toISOString().slice(0, 10);
}

// Most past deadlines have already been filed; most upcoming ones have not.
function pickStatus(random, dueOffsetDays) {
  const submittedPercent =
    dueOffsetDays < 0 ? PAST_DUE_SUBMITTED_PERCENT : UPCOMING_SUBMITTED_PERCENT;
  const rollPercent = random() * 100;
  if (rollPercent < submittedPercent) {
    return "submitted";
  }
  return rollPercent < submittedPercent + IN_PROGRESS_PERCENT
    ? "in progress"
    : "not started";
}

export function generateSeedDeadlines(random, todayIso, createdAt) {
  const deadlines = [];
  for (let ownerNumber = 1; ownerNumber <= SEED_OWNER_COUNT; ownerNumber += 1) {
    const ownerId = `${SEED_OWNER_ID_PREFIX}${String(ownerNumber).padStart(4, "0")}`;
    const deadlineCount = pickInteger(
      random,
      MINIMUM_DEADLINES_PER_OWNER,
      MAXIMUM_DEADLINES_PER_OWNER,
    );
    for (
      let deadlineIndex = 0;
      deadlineIndex < deadlineCount;
      deadlineIndex += 1
    ) {
      const dueOffsetDays = pickInteger(
        random,
        EARLIEST_DUE_OFFSET_DAYS,
        LATEST_DUE_OFFSET_DAYS,
      );
      deadlines.push({
        ownerId,
        documentType: pickItem(random, DOCUMENT_TYPES),
        dueDate: addDaysToIsoDate(todayIso, dueOffsetDays),
        status: pickStatus(random, dueOffsetDays),
        notes: pickItem(random, SAMPLE_NOTES),
        createdAt,
        updatedAt: createdAt,
      });
    }
  }
  return deadlines;
}
