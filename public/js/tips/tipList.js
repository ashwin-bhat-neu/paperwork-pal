import { createElement } from "../shared/createElement.js";

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatTipDate(isoTimestamp) {
  return DATE_FORMAT.format(new Date(isoTimestamp));
}

function describeTipDate(tip) {
  const wasEdited = tip.updatedAt !== tip.createdAt;
  return wasEdited
    ? `Posted ${formatTipDate(tip.createdAt)}, edited ${formatTipDate(tip.updatedAt)}`
    : `Posted ${formatTipDate(tip.createdAt)}`;
}

function createActionButton(label, accessibleLabel, className, onClick) {
  const button = createElement("button", className, label);
  button.type = "button";
  button.setAttribute("aria-label", accessibleLabel);
  button.addEventListener("click", onClick);
  return button;
}

// Only the author's own tips get actions; the server enforces this as well.
function createTipActions(tip, { onEdit, onDelete }) {
  const actions = createElement("div", "tip-card__actions");
  actions.append(
    createActionButton("Edit", `Edit "${tip.title}"`, "tip-card__action", () =>
      onEdit(tip),
    ),
    createActionButton(
      "Delete",
      `Delete "${tip.title}"`,
      "tip-card__action tip-card__action--danger",
      () => onDelete(tip),
    ),
  );
  return actions;
}

function createTipCard(tip, { editingTipId, onEdit, onDelete }) {
  const card = createElement("li", "tip-card");
  card.classList.toggle("tip-card--editing", tip._id === editingTipId);

  const labels = createElement("div", "tip-card__labels");
  labels.append(
    createElement("span", "tip-card__process", tip.process),
    createElement("span", "tip-card__unverified", "Unverified"),
  );
  if (tip.isMine) {
    labels.append(createElement("span", "tip-card__mine", "Your tip"));
  }

  const footer = createElement("div", "tip-card__footer");
  footer.append(createElement("p", "tip-card__date", describeTipDate(tip)));
  if (tip.isMine) {
    footer.append(createTipActions(tip, { onEdit, onDelete }));
  }

  card.append(
    labels,
    createElement("h2", "tip-card__title", tip.title),
    createElement("p", "tip-card__body", tip.body),
    footer,
  );
  return card;
}

export function renderTipList(listElement, tips, options) {
  listElement.replaceChildren(
    ...tips.map((tip) => createTipCard(tip, options)),
  );
}
