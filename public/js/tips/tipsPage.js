import { createTipForm } from "./tipForm.js";
import { renderTipList } from "./tipList.js";
import { createTip, deleteTip, fetchTips, updateTip } from "./tipsApi.js";

const listElement = document.querySelector("#tip-list");
const loadingElement = document.querySelector("#tips-loading");
const emptyStateElement = document.querySelector("#tips-empty");
const emptyStateTitleElement = document.querySelector("#tips-empty-title");
const pageErrorElement = document.querySelector("#tips-error");
const filterButtons = document.querySelectorAll(".tip-filter__option");
const tipForm = createTipForm(document.querySelector("#tip-form"), {
  onSubmit: saveTip,
  onCancel: render,
});
let tips = [];
// An empty string means every process.
let processFilter = "";
// Counts requests so a slow answer for an old filter can't replace a newer one.
let latestRequestNumber = 0;

function showPageError(message) {
  pageErrorElement.textContent = message;
  pageErrorElement.hidden = !message;
}

function render() {
  renderTipList(listElement, tips, {
    editingTipId: tipForm.getEditingTipId(),
    onEdit: startEditing,
    onDelete: confirmAndDelete,
  });
  emptyStateTitleElement.textContent = processFilter
    ? `No ${processFilter} tips yet`
    : "No tips yet";
  emptyStateElement.hidden = tips.length > 0;
}

async function reloadTips() {
  const requestNumber = ++latestRequestNumber;
  try {
    const loadedTips = await fetchTips(processFilter);
    if (requestNumber !== latestRequestNumber) {
      return;
    }
    tips = loadedTips;
    render();
  } catch (error) {
    if (requestNumber === latestRequestNumber) {
      showPageError(`Could not load tips. ${error.message}`);
    }
  } finally {
    loadingElement.hidden = true;
  }
}

function selectProcessFilter(process) {
  processFilter = process;
  for (const button of filterButtons) {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.process === process),
    );
  }
  showPageError("");
  return reloadTips();
}

async function runThenReload(action) {
  showPageError("");
  try {
    await action();
  } catch (error) {
    showPageError(error.message);
  }
  await reloadTips();
}

async function saveTip(fields, editingTipId) {
  if (editingTipId) {
    await updateTip(editingTipId, fields);
  } else {
    await createTip(fields);
  }
  tipForm.stopEditing();
  // Switch to the tip's process if the current filter would hide it.
  if (processFilter && fields.process !== processFilter) {
    await selectProcessFilter(fields.process);
  } else {
    await reloadTips();
  }
}

function startEditing(tip) {
  tipForm.startEditing(tip);
  render();
}

function confirmAndDelete(tip) {
  const isConfirmed = window.confirm(
    `Delete your tip "${tip.title}"? This can't be undone.`,
  );
  if (!isConfirmed) {
    return;
  }
  if (tipForm.getEditingTipId() === tip._id) {
    tipForm.stopEditing();
  }
  return runThenReload(() => deleteTip(tip._id));
}

for (const button of filterButtons) {
  button.addEventListener("click", () =>
    selectProcessFilter(button.dataset.process),
  );
}

reloadTips();
