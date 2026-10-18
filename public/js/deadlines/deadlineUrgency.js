const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const DUE_SOON_WINDOW_DAYS = 7;
const dueDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

// Due dates are date-only strings; reading them as UTC midnight keeps day differences exact.
function isoDateToUtcMilliseconds(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function formatLocalDateAsIso(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDueDate(isoDate) {
  return dueDateFormatter.format(isoDateToUtcMilliseconds(isoDate));
}

export function calculateDaysRemaining(dueDateIso, todayIso) {
  const differenceMilliseconds =
    isoDateToUtcMilliseconds(dueDateIso) - isoDateToUtcMilliseconds(todayIso);
  return differenceMilliseconds / MILLISECONDS_PER_DAY;
}

function pluralizeDays(dayCount) {
  return dayCount === 1 ? "1 day" : `${dayCount} days`;
}

export function describeDaysRemaining(daysRemaining) {
  if (daysRemaining < 0) {
    return `${pluralizeDays(-daysRemaining)} late`;
  }
  if (daysRemaining === 0) {
    return "Due today";
  }
  return `${pluralizeDays(daysRemaining)} left`;
}

export function classifyUrgency(deadline, todayIso) {
  if (deadline.status === "submitted") {
    return "submitted";
  }
  const daysRemaining = calculateDaysRemaining(deadline.dueDate, todayIso);
  if (daysRemaining < 0) {
    return "overdue";
  }
  return daysRemaining <= DUE_SOON_WINDOW_DAYS ? "soon" : "later";
}

export function countUrgentDeadlines(deadlines, todayIso) {
  const urgencies = deadlines.map((deadline) =>
    classifyUrgency(deadline, todayIso),
  );
  return {
    overdueCount: urgencies.filter((urgency) => urgency === "overdue").length,
    dueSoonCount: urgencies.filter((urgency) => urgency === "soon").length,
  };
}
