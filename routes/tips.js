import express from "express";
import {
  deleteTip,
  insertTip,
  listTips,
  updateTip,
} from "../db/tipsCollection.js";
import { parseObjectId } from "../db/parseObjectId.js";
import { readOwnerId, requireOwnerId } from "../middleware/ownerId.js";
import {
  validateNewTip,
  validateProcessFilter,
  validateTipChanges,
} from "../validation/tipValidation.js";

const tipsRouter = express.Router();

function sendValidationErrors(response, errors) {
  response.status(400).json({ error: errors.join(" ") });
}

function sendTipNotFound(response) {
  response.status(404).json({ error: "Tip not found." });
}

// Public: anyone can browse. A valid owner ID only marks which tips are the viewer's.
tipsRouter.get("/", readOwnerId, async (request, response) => {
  const { processFilter, errors } = validateProcessFilter(request.query);
  if (errors.length > 0) {
    sendValidationErrors(response, errors);
    return;
  }
  response.json(await listTips({ processFilter, viewerId: request.ownerId }));
});

tipsRouter.post("/", requireOwnerId, async (request, response) => {
  const { fields, errors } = validateNewTip(request.body);
  if (errors.length > 0) {
    sendValidationErrors(response, errors);
    return;
  }
  const tip = await insertTip(request.ownerId, fields);
  response.status(201).json(tip);
});

// A tip that exists but belongs to someone else also gets 404, so
// non-authors cannot tell other people's tips apart from missing ones.
tipsRouter.patch("/:tipId", requireOwnerId, async (request, response) => {
  const tipId = parseObjectId(request.params.tipId);
  if (!tipId) {
    sendTipNotFound(response);
    return;
  }
  const { fields, errors } = validateTipChanges(request.body);
  if (errors.length > 0) {
    sendValidationErrors(response, errors);
    return;
  }
  const tip = await updateTip(request.ownerId, tipId, fields);
  if (!tip) {
    sendTipNotFound(response);
    return;
  }
  response.json(tip);
});

tipsRouter.delete("/:tipId", requireOwnerId, async (request, response) => {
  const tipId = parseObjectId(request.params.tipId);
  if (!tipId || !(await deleteTip(request.ownerId, tipId))) {
    sendTipNotFound(response);
    return;
  }
  response.status(204).end();
});

export default tipsRouter;