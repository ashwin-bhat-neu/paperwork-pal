import { getDatabase } from "./connection.js";

async function getDeadlinesCollection() {
  const database = await getDatabase();
  return database.collection("deadlines");
}

export async function createDeadlineIndexes() {
  const deadlines = await getDeadlinesCollection();
  // Serves the per-owner list sorted by due date.
  await deadlines.createIndex({ ownerId: 1, dueDate: 1 });
}

export async function replaceDeadlinesOfOwnersWithPrefix(
  ownerIdPrefix,
  replacementDeadlines,
) {
  const deadlines = await getDeadlinesCollection();
  const escapedPrefix = ownerIdPrefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const { deletedCount } = await deadlines.deleteMany({
    ownerId: { $regex: `^${escapedPrefix}` },
  });
  const { insertedCount } = await deadlines.insertMany(replacementDeadlines);
  return { deletedCount, insertedCount };
}

export async function countAllDeadlines() {
  const deadlines = await getDeadlinesCollection();
  return deadlines.countDocuments();
}

export async function listDeadlinesForOwner(ownerId) {
  const deadlines = await getDeadlinesCollection();
  return deadlines.find({ ownerId }).sort({ dueDate: 1, _id: 1 }).toArray();
}

export async function insertDeadline(ownerId, deadlineFields) {
  const deadlines = await getDeadlinesCollection();
  const now = new Date();
  const deadline = {
    ownerId,
    ...deadlineFields,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await deadlines.insertOne(deadline);
  return { _id: insertedId, ...deadline };
}

// Every query filters on ownerId too, so one owner can never touch another's deadline.
export async function updateDeadline(ownerId, deadlineId, changedFields) {
  const deadlines = await getDeadlinesCollection();
  return deadlines.findOneAndUpdate(
    { _id: deadlineId, ownerId },
    { $set: { ...changedFields, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteDeadline(ownerId, deadlineId) {
  const deadlines = await getDeadlinesCollection();
  const { deletedCount } = await deadlines.deleteOne({
    _id: deadlineId,
    ownerId,
  });
  return deletedCount === 1;
}
