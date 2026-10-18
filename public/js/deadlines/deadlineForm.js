// Owns the form's add/edit mode; the page asks it which deadline is being edited.
export function createDeadlineForm(formElement, { onSubmit, onCancel }) {
  const { documentType, dueDate, notes } = formElement.elements;
  const title = formElement.querySelector(".deadline-form__title");
  const submitButton = formElement.querySelector('[type="submit"]');
  const cancelButton = formElement.querySelector(".deadline-form__cancel");
  const errorMessage = formElement.querySelector(".deadline-form__error");
  let editingDeadlineId = null;

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = !message;
  }

  function showMode() {
    const isEditing = editingDeadlineId !== null;
    title.textContent = isEditing ? "Edit deadline" : "Add a deadline";
    submitButton.textContent = isEditing ? "Save changes" : "Add deadline";
    cancelButton.hidden = !isEditing;
  }

  function startEditing(deadline) {
    editingDeadlineId = deadline._id;
    documentType.value = deadline.documentType;
    dueDate.value = deadline.dueDate;
    notes.value = deadline.notes;
    showError("");
    showMode();
    documentType.focus();
  }

  function stopEditing() {
    editingDeadlineId = null;
    formElement.reset();
    showError("");
    showMode();
  }

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = {
      documentType: documentType.value,
      dueDate: dueDate.value,
      notes: notes.value,
    };
    submitButton.disabled = true;
    try {
      await onSubmit(fields, editingDeadlineId);
    } catch (error) {
      showError(error.message);
    } finally {
      submitButton.disabled = false;
    }
  });

  cancelButton.addEventListener("click", () => {
    stopEditing();
    onCancel();
  });

  return {
    startEditing,
    stopEditing,
    getEditingDeadlineId: () => editingDeadlineId,
  };
}
