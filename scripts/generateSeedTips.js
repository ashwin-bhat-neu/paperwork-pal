import { SEED_TIP_TEMPLATES } from "./seedTipTemplates.js";

export const SEED_AUTHOR_ID_PREFIX = "seed-author-";
const SEED_AUTHOR_COUNT = 250;
// An average of four per author gives about 1,000 tips.
const MINIMUM_TIPS_PER_AUTHOR = 2;
const MAXIMUM_TIPS_PER_AUTHOR = 6;
const OLDEST_TIP_AGE_DAYS = 730;
const EDITED_PERCENT = 20;
const LONGEST_EDIT_DELAY_DAYS = 60;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
// Added to the end of some tips so repeated templates don't read identically.
const CLOSING_LINES = [
  "",
  "",
  "",
  "Learned this the hard way.",
  "Your DSO can confirm the details for your situation.",
  "Hope this saves someone the stress.",
  "Rules change, so double-check the official page.",
  "Wish someone had told me this earlier.",
];

function pickInteger(random, minimum, maximum) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function pickItem(random, items) {
  return items[Math.floor(random() * items.length)];
}

function pickCreatedAt(random, now) {
  const ageMilliseconds = random() * OLDEST_TIP_AGE_DAYS * MILLISECONDS_PER_DAY;
  return new Date(now.getTime() - ageMilliseconds);
}

// Some tips were edited after posting, but never later than now.
function pickUpdatedAt(random, createdAt, now) {
  if (random() * 100 >= EDITED_PERCENT) {
    return createdAt;
  }
  const delayMilliseconds =
    random() * LONGEST_EDIT_DELAY_DAYS * MILLISECONDS_PER_DAY;
  return new Date(
    Math.min(createdAt.getTime() + delayMilliseconds, now.getTime()),
  );
}

export function generateSeedTips(random, now) {
  const tips = [];
  for (
    let authorNumber = 1;
    authorNumber <= SEED_AUTHOR_COUNT;
    authorNumber += 1
  ) {
    const ownerId = `${SEED_AUTHOR_ID_PREFIX}${String(authorNumber).padStart(4, "0")}`;
    const tipCount = pickInteger(
      random,
      MINIMUM_TIPS_PER_AUTHOR,
      MAXIMUM_TIPS_PER_AUTHOR,
    );
    for (let tipIndex = 0; tipIndex < tipCount; tipIndex += 1) {
      const template = pickItem(random, SEED_TIP_TEMPLATES);
      const closingLine = pickItem(random, CLOSING_LINES);
      const createdAt = pickCreatedAt(random, now);
      tips.push({
        ownerId,
        process: template.process,
        title: template.title,
        body: closingLine ? `${template.body} ${closingLine}` : template.body,
        createdAt,
        updatedAt: pickUpdatedAt(random, createdAt, now),
      });
    }
  }
  return tips;
}
