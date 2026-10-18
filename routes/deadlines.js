import express from "express";
import {
  deleteDeadline,
  insertDeadline,
  listDeadlinesForOwner,
  updateDeadline,
} from "../db/deadlinesCollection.js";
import { parseObjectId } from "../db/parseObjectId.js";
import { requireOwnerId } from "../middleware/ownerId.js";
import {
  validateDeadlineChanges,
  validateNewDeadline,
} from "../validation/deadlineValidation.js";

const deadlinesRouter = express.Router();
deadlinesRouter.use(requireOwnerId);

function sendValidationErrors(response, errors) {
  response.status(400).json({ error: errors.join(" ") });
}

function sendDeadlineNotFound(response) {
  response.status(404).json({ error: "Deadline not found." });
}

deadlinesRouter.get("/", async (request, response) => {
  response.json(await listDeadlinesForOwner(request.ownerId));
});

deadlinesRouter.post("/", async (request, response) => {
  const { fields, errors } = validateNewDeadline(request.body);
  if (errors.length > 0) {
    sendValidationErrors(response, errors);
    return;
  }
  const deadline = await insertDeadline(request.ownerId, fields);
  response.status(201).json(deadline);
});

deadlinesRouter.patch("/:deadlineId", async (request, response) => {
  const deadlineId = parseObjectId(request.params.deadlineId);
  if (!deadlineId) {
    sendDeadlineNotFound(response);
    return;
  }
  const { fields, errors } = validateDeadlineChanges(request.body);
  if (errors.length > 0) {
    sendValidationErrors(response, errors);
    return;
  }
  const deadline = await updateDeadline(request.ownerId, deadlineId, fields);
  if (!deadline) {
    sendDeadlineNotFound(response);
    return;
  }
  response.json(deadline);
});

deadlinesRouter.delete("/:deadlineId", async (request, response) => {
  const deadlineId = parseObjectId(request.params.deadlineId);
  if (!deadlineId || !(await deleteDeadline(request.ownerId, deadlineId))) {
    sendDeadlineNotFound(response);
    return;
  }
  response.status(204).end();
});

export default deadlinesRouter;
