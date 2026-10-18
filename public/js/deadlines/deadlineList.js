import { createElement } from "../shared/createElement.js";
import {
  calculateDaysRemaining,
  classifyUrgency,
  describeDaysRemaining,
  formatDueDate,
} from "./deadlineUrgency.js";

const STATUS_LABELS = {
  "not started": "Not started",
  "in progress": "In progress",
  submitted: "Submitted",
};

function createButton(label, variant, accessibleName, onClick) {
  const button = createElement(
    "button",
    `button button--${variant} button--small`,
    label,
  );
  button.type = "button";
  button.setAttribute("aria-label", accessibleName);
  button.addEventListener("click", onClick);
  return button;
}

function createStatusSelect(deadline, onStatusChange) {
  const select = createElement("select", "form-control deadline-card__status");
  select.setAttribute("aria-label", `Status of ${deadline.documentType}`);
  for (const [status, label] of Object.entries(STATUS_LABELS)) {
    select.append(new Option(label, status, false, status === deadline.status));
  }
  select.addEventListener("change", () =>
    onStatusChange(deadline, select.value),
  );
  return select;
}

function createDeadlineCard(deadline, options) {
  const { todayIso, editingDeadlineId, onStatusChange, onEdit, onDelete } =
    options;
  const urgency = classifyUrgency(deadline, todayIso);
  const card = createElement("li", `deadline-card deadline-card--${urgency}`);
  card.classList.toggle(
    "deadline-card--editing",
    deadline._id === editingDeadlineId,
  );

  const header = createElement("div", "deadline-card__header");
  const daysRemaining = calculateDaysRemaining(deadline.dueDate, todayIso);
  header.append(
    createElement("h2", "deadline-card__title", deadline.documentType),
    createElement(
      "span",
      "deadline-card__days",
      describeDaysRemaining(daysRemaining),
    ),
  );
  card.append(
    header,
    createElement(
      "p",
      "deadline-card__due-date",
      `Due ${formatDueDate(deadline.dueDate)}`,
    ),
  );
  if (deadline.notes) {
    card.append(createElement("p", "deadline-card__notes", deadline.notes));
  }

  const actions = createElement("div", "deadline-card__actions");
  actions.append(
    createStatusSelect(deadline, onStatusChange),
    createButton("Edit", "secondary", `Edit ${deadline.documentType}`, () =>
      onEdit(deadline),
    ),
    createButton("Delete", "danger", `Delete ${deadline.documentType}`, () =>
      onDelete(deadline),
    ),
  );
  card.append(actions);
  return card;
}

export function renderDeadlineList(listElement, deadlines, options) {
  listElement.replaceChildren(
    ...deadlines.map((deadline) => createDeadlineCard(deadline, options)),
  );
}
