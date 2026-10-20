// Owns the form's add/edit mode; the page asks it which tip is being edited.
export function createTipForm(formElement, { onSubmit, onCancel }) {
  const { process, title, body } = formElement.elements;
  const formTitle = formElement.querySelector(".tip-form__title");
  const submitButton = formElement.querySelector('[type="submit"]');
  const cancelButton = formElement.querySelector(".tip-form__cancel");
  const errorMessage = formElement.querySelector(".tip-form__error");
  let editingTipId = null;

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = !message;
  }

  function showMode() {
    const isEditing = editingTipId !== null;
    formTitle.textContent = isEditing ? "Edit your tip" : "Share a tip";
    submitButton.textContent = isEditing ? "Save changes" : "Post tip";
    cancelButton.hidden = !isEditing;
  }

  function startEditing(tip) {
    editingTipId = tip._id;
    process.value = tip.process;
    title.value = tip.title;
    body.value = tip.body;
    showError("");
    showMode();
    process.focus();
  }

  function stopEditing() {
    editingTipId = null;
    formElement.reset();
    showError("");
    showMode();
  }

  formElement.addEventListener("submit", async (event) => {
    event.preventDefault();
    // The server trims text and rejects a title or tip that is only spaces.
    const fields = {
      process: process.value,
      title: title.value,
      body: body.value,
    };
    submitButton.disabled = true;
    try {
      await onSubmit(fields, editingTipId);
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
    getEditingTipId: () => editingTipId,
  };
}
