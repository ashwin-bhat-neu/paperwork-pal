import { createElement } from "../shared/createElement.js";
import { countUrgentDeadlines } from "./deadlineUrgency.js";

export function renderDeadlineSummary(summaryElement, deadlines, todayIso) {
  const { overdueCount, dueSoonCount } = countUrgentDeadlines(
    deadlines,
    todayIso,
  );
  const pills = [];
  if (overdueCount > 0) {
    pills.push(
      createElement(
        "li",
        "summary-pill summary-pill--overdue",
        `${overdueCount} overdue`,
      ),
    );
  }
  if (dueSoonCount > 0) {
    pills.push(
      createElement(
        "li",
        "summary-pill summary-pill--soon",
        `${dueSoonCount} due this week`,
      ),
    );
  }
  summaryElement.replaceChildren(...pills);
}
