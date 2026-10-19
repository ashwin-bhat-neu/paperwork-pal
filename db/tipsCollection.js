import { getDatabase } from "./connection.js";

async function getTipsCollection() {
  const database = await getDatabase();
  return database.collection("tips");
}

export async function createTipIndexes() {
  const tips = await getTipsCollection();
  // Serves the whole board, newest first.
  await tips.createIndex({ createdAt: -1 });
  // Serves the board filtered by process, newest first.
  await tips.createIndex({ process: 1, createdAt: -1 });
}

export async function replaceTipsOfOwnersWithPrefix(
  ownerIdPrefix,
  replacementTips,
) {
  const tips = await getTipsCollection();
  const escapedPrefix = ownerIdPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const { deletedCount } = await tips.deleteMany({
    ownerId: { $regex: `^${escapedPrefix}` },
  });
  const { insertedCount } = await tips.insertMany(replacementTips);
  return { deletedCount, insertedCount };
}

export async function countAllTips() {
  const tips = await getTipsCollection();
  return tips.countDocuments();
}

// Tips are public but their owner IDs are not: anyone who knew an author's ID
// could send it as their own header and edit that author's tips. Each tip is
// sent with isMine instead, worked out against the viewer's own ID.
function toPublicTip(tip, viewerId) {
  const { ownerId, ...publicFields } = tip;
  return { ...publicFields, isMine: ownerId === viewerId };
}

// viewerId is null for visitors who sent no owner ID; then nothing is theirs.
export async function listTips({ processFilter, viewerId }) {
  const tips = await getTipsCollection();
  const filter = processFilter ? { process: processFilter } : {};
  const matchingTips = await tips
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .toArray();
  return matchingTips.map((tip) => toPublicTip(tip, viewerId));
}

export async function insertTip(ownerId, tipFields) {
  const tips = await getTipsCollection();
  const now = new Date();
  const tip = {
    ownerId,
    ...tipFields,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await tips.insertOne(tip);
  return toPublicTip({ _id: insertedId, ...tip }, ownerId);
}

// Every write filters on ownerId too, so only a tip's author can change it.
export async function updateTip(ownerId, tipId, changedFields) {
  const tips = await getTipsCollection();
  const tip = await tips.findOneAndUpdate(
    { _id: tipId, ownerId },
    { $set: { ...changedFields, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return tip ? toPublicTip(tip, ownerId) : null;
}

export async function deleteTip(ownerId, tipId) {
  const tips = await getTipsCollection();
  const { deletedCount } = await tips.deleteOne({ _id: tipId, ownerId });
  return deletedCount === 1;
}