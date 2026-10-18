import { createDeadlineForm } from "./deadlineForm.js";
import { renderDeadlineList } from "./deadlineList.js";
import {
  createDeadline,
  deleteDeadline,
  fetchDeadlines,
  updateDeadline,
} from "./deadlinesApi.js";
import { renderDeadlineSummary } from "./deadlineSummary.js";
import { formatDueDate, formatLocalDateAsIso } from "./deadlineUrgency.js";

const listElement = document.querySelector("#deadline-list");
const summaryElement = document.querySelector("#deadline-summary");
const loadingElement = document.querySelector("#deadlines-loading");
const emptyStateElement = document.querySelector("#deadlines-empty");
const pageErrorElement = document.querySelector("#deadlines-error");
const deadlineForm = createDeadlineForm(
  document.querySelector("#deadline-form"),
  { onSubmit: saveDeadline, onCancel: render },
);
let deadlines = [];

function showPageError(message) {
  pageErrorElement.textContent = message;
  pageErrorElement.hidden = !message;
}

function render() {
  const todayIso = formatLocalDateAsIso(new Date());
  renderDeadlineSummary(summaryElement, deadlines, todayIso);
  renderDeadlineList(listElement, deadlines, {
    todayIso,
    editingDeadlineId: deadlineForm.getEditingDeadlineId(),
    onStatusChange: changeStatus,
    onEdit: startEditing,
    onDelete: confirmAndDelete,
  });
  emptyStateElement.hidden = deadlines.length > 0;
}

async function reloadDeadlines() {
  try {
    deadlines = await fetchDeadlines();
    render();
  } catch (error) {
    showPageError(`Could not load your deadlines. ${error.message}`);
  } finally {
    loadingElement.hidden = true;
  }
}

async function runThenReload(action) {
  showPageError("");
  try {
    await action();
  } catch (error) {
    showPageError(error.message);
  }
  await reloadDeadlines();
}

async function saveDeadline(fields, editingDeadlineId) {
  if (editingDeadlineId) {
    await updateDeadline(editingDeadlineId, fields);
  } else {
    await createDeadline(fields);
  }
  deadlineForm.stopEditing();
  await reloadDeadlines();
}

function changeStatus(deadline, status) {
  return runThenReload(() => updateDeadline(deadline._id, { status }));
}

function startEditing(deadline) {
  deadlineForm.startEditing(deadline);
  render();
}

function confirmAndDelete(deadline) {
  const isConfirmed = window.confirm(
    `Delete "${deadline.documentType}" due ${formatDueDate(deadline.dueDate)}? This can't be undone.`,
  );
  if (!isConfirmed) {
    return;
  }
  if (deadlineForm.getEditingDeadlineId() === deadline._id) {
    deadlineForm.stopEditing();
  }
  return runThenReload(() => deleteDeadline(deadline._id));
}

reloadDeadlines();
