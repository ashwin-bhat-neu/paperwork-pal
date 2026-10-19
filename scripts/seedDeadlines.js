import { closeDatabaseConnection } from "../db/connection.js";
import {
  countAllDeadlines,
  createDeadlineIndexes,
  replaceDeadlinesOfOwnersWithPrefix,
} from "../db/deadlinesCollection.js";
import { createSeededRandom } from "./createSeededRandom.js";
import {
  generateSeedDeadlines,
  SEED_OWNER_ID_PREFIX,
} from "./generateSeedDeadlines.js";

// Fixed so every run on the same day produces the same deadlines.
const RANDOM_SEED = 20261018;

try {
  const now = new Date();
  const seedDeadlines = generateSeedDeadlines(
    createSeededRandom(RANDOM_SEED),
    now.toISOString().slice(0, 10),
    now,
  );
  await createDeadlineIndexes();
  const { deletedCount, insertedCount } =
    await replaceDeadlinesOfOwnersWithPrefix(
      SEED_OWNER_ID_PREFIX,
      seedDeadlines,
    );
  console.log(
    `Removed ${deletedCount} old seed deadlines and inserted ${insertedCount}.`,
  );
  console.log(
    `The deadlines collection now holds ${await countAllDeadlines()} records.`,
  );
} finally {
  await closeDatabaseConnection();
}
