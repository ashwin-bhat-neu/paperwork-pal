import { closeDatabaseConnection } from "../db/connection.js";
import {
  countAllTips,
  createTipIndexes,
  replaceTipsOfOwnersWithPrefix,
} from "../db/tipsCollection.js";
import { createSeededRandom } from "./createSeededRandom.js";
import { generateSeedTips, SEED_AUTHOR_ID_PREFIX } from "./generateSeedTips.js";

// Fixed so every run picks the same tips and authors; only the dates move with today.
const RANDOM_SEED = 20261019;

try {
  const seedTips = generateSeedTips(
    createSeededRandom(RANDOM_SEED),
    new Date(),
  );
  await createTipIndexes();
  const { deletedCount, insertedCount } = await replaceTipsOfOwnersWithPrefix(
    SEED_AUTHOR_ID_PREFIX,
    seedTips,
  );
  console.log(
    `Removed ${deletedCount} old seed tips and inserted ${insertedCount}.`,
  );
  console.log(`The tips collection now holds ${await countAllTips()} records.`);
} finally {
  await closeDatabaseConnection();
}
