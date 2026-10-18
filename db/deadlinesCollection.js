import { getDatabase } from "./connection.js";

async function getDeadlinesCollection() {
  const database = await getDatabase();
  return database.collection("deadlines");
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
