export const TIP_PROCESSES = [
    "OPT",
    "STEM OPT",
    "I-20 and travel",
    "Taxes",
    "Visa",
    "Other",
  ];
  
  const TITLE_MAXIMUM_CHARACTERS = 120;
  const BODY_MAXIMUM_CHARACTERS = 2000;
  
  // Title and body are required, so text that is only spaces does not count.
  function isTextWithin(value, maximumCharacters) {
    if (typeof value !== "string") {
      return false;
    }
    const length = value.trim().length;
    return length >= 1 && length <= maximumCharacters;
  }
  
  const FIELD_RULES = {
    process: {
      isValid: (value) => TIP_PROCESSES.includes(value),
      message: `Process must be one of: ${TIP_PROCESSES.join(", ")}.`,
    },
    title: {
      isValid: (value) => isTextWithin(value, TITLE_MAXIMUM_CHARACTERS),
      message: `Title must be text of 1 to ${TITLE_MAXIMUM_CHARACTERS} characters.`,
      normalize: (value) => value.trim(),
    },
    body: {
      isValid: (value) => isTextWithin(value, BODY_MAXIMUM_CHARACTERS),
      message: `Tip must be text of 1 to ${BODY_MAXIMUM_CHARACTERS} characters.`,
      normalize: (value) => value.trim(),
    },
  };
  const REQUIRED_FIELD_LABELS = {
    process: "Process",
    title: "Title",
    body: "Tip",
  };
  const NOT_AN_OBJECT_ERROR = "Request body must be a JSON object.";
  
  function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  
  // Unknown fields such as ownerId, _id, or isMine are dropped, so clients cannot set them.
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
  
  export function validateNewTip(input) {
    if (!isPlainObject(input)) {
      return { fields: {}, errors: [NOT_AN_OBJECT_ERROR] };
    }
    const { fields, errors } = collectKnownFields(input);
    for (const [fieldName, label] of Object.entries(REQUIRED_FIELD_LABELS)) {
      if (!Object.hasOwn(input, fieldName)) {
        errors.push(`${label} is required.`);
      }
    }
    return { fields, errors };
  }
  
  export function validateTipChanges(input) {
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
  
  // A missing or empty ?process= means "all tips"; anything else must be a known process.
  export function validateProcessFilter(query) {
    const value = query.process;
    if (value === undefined || value === "") {
      return { processFilter: null, errors: [] };
    }
    if (!TIP_PROCESSES.includes(value)) {
      return { processFilter: null, errors: [FIELD_RULES.process.message] };
    }
    return { processFilter: value, errors: [] };
  }