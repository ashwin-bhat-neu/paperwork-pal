export const DOCUMENT_TYPES = [
  "OPT application",
  "STEM OPT extension",
  "I-20 travel signature",
  "Form 8843",
  "Federal tax return",
  "State tax return",
  "Visa renewal",
  "SEVP address update",
  "Other",
];
export const DEADLINE_STATUSES = ["not started", "in progress", "submitted"];

const NOTES_MAXIMUM_CHARACTERS = 500;
// Bounds catch mistyped years such as 0026 from a half-filled date input.
const EARLIEST_DUE_YEAR = 2000;
const LATEST_DUE_YEAR = 2100;
const DUE_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isValidDueDate(value) {
  const match = typeof value === "string" && DUE_DATE_PATTERN.exec(value);
  if (!match) {
    return false;
  }
  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    year >= EARLIEST_DUE_YEAR &&
    year <= LATEST_DUE_YEAR &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const FIELD_RULES = {
  documentType: {
    isValid: (value) => DOCUMENT_TYPES.includes(value),
    message: `Document type must be one of: ${DOCUMENT_TYPES.join(", ")}.`,
  },
  dueDate: {
    isValid: isValidDueDate,
    message: `Due date must be a real date in YYYY-MM-DD format between ${EARLIEST_DUE_YEAR} and ${LATEST_DUE_YEAR}.`,
  },
  status: {
    isValid: (value) => DEADLINE_STATUSES.includes(value),
    message: `Status must be one of: ${DEADLINE_STATUSES.join(", ")}.`,
  },
  notes: {
    isValid: (value) =>
      typeof value === "string" &&
      value.trim().length <= NOTES_MAXIMUM_CHARACTERS,
    message: `Notes must be text of at most ${NOTES_MAXIMUM_CHARACTERS} characters.`,
    normalize: (value) => value.trim(),
  },
};
const REQUIRED_FIELD_LABELS = {
  documentType: "Document type",
  dueDate: "Due date",
};
const NEW_DEADLINE_DEFAULTS = { status: "not started", notes: "" };
const NOT_AN_OBJECT_ERROR = "Request body must be a JSON object.";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Unknown fields such as ownerId or _id are dropped, so clients cannot set them.
function collectKnownFields(input) {
  const fields = {};
  const errors = [];
  for (const [fieldName, rule] of Object.entries(FIELD_RULES)) {
    if (!Object.hasOwn(input, fieldName)) {
      continue;
    }
    const value = input[fieldName];
    if (rule.isValid(value)) {
      fields[fieldName] = rule.normalize ? rule.normalize(value) : value;
    } else {
      errors.push(rule.message);
    }
  }
  return { fields, errors };
}

export function validateNewDeadline(input) {
  if (!isPlainObject(input)) {
    return { fields: {}, errors: [NOT_AN_OBJECT_ERROR] };
  }
  const { fields, errors } = collectKnownFields(input);
  for (const [fieldName, label] of Object.entries(REQUIRED_FIELD_LABELS)) {
    if (!Object.hasOwn(input, fieldName)) {
      errors.push(`${label} is required.`);
    }
  }
  return { fields: { ...NEW_DEADLINE_DEFAULTS, ...fields }, errors };
}

export function validateDeadlineChanges(input) {
  if (!isPlainObject(input)) {
    return { fields: {}, errors: [NOT_AN_OBJECT_ERROR] };
  }
  const { fields, errors } = collectKnownFields(input);
  if (errors.length === 0 && Object.keys(fields).length === 0) {
    errors.push(
      `Provide at least one of: ${Object.keys(FIELD_RULES).join(", ")}.`,
    );
  }
  return { fields, errors };
}
