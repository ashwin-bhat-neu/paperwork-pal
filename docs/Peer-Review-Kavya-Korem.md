# Peer Review: Paperwork Pal

**Reviewer:** Kavya Korem
**Date:** October 22, 2026
**Project:** [Paperwork Pal](https://paperwork-pal-one.vercel.app) by Ashwin Bhat and Mohammed Sameer Sarfaraz Bake

---

## Overall Assessment

Paperwork Pal solves a real and specific problem: international students have to track immigration and tax deadlines that can affect their visa status, and general calendar apps don't know about them. The app combines a personal deadline tracker with a community tips board, and both features work as full CRUD applications. The project is well organized, clearly documented, and thoughtfully designed for its audience.

---

## Positive Feedback

- **Clear purpose and audience.** The landing page explains what the app does and how to use it in four simple steps, so a new user knows where to start right away.
- **Responsible content handling.** The "Not legal advice" disclaimer and the "unverified" label on tips are appropriate for a site about immigration rules. The reminder on the Tips form not to share personal details like a SEVIS ID or address is a thoughtful privacy touch.
- **Privacy-conscious API design.** Returning an `isMine` flag instead of the author's owner ID means users can't see or copy other people's IDs.
- **Useful urgency display.** Sorting deadlines soonest first, showing days remaining or days late, and color-coding overdue (red) and due-this-week (amber) deadlines makes the most important information easy to see.
- **Clean code organization.** Separating `routes/`, `middleware/`, `validation/`, and `db/` keeps responsibilities clear. Keeping validation independent of the database also makes it easier to test.
- **Good development tooling.** ESLint, Prettier, unit tests with `node:test`, and seed scripts that generate over 1,000 records each show solid engineering habits.
- **Thorough README.** The setup steps, scripts table, API reference, and project structure make the project easy to run and understand.
- **Safe destructive actions.** Asking for confirmation before deleting a deadline or tip prevents accidental data loss.

---

## Suggestions for Improvement

1. **Owner ID can be impersonated.** Because identity comes from an `X-Owner-Id` header generated in the browser, anyone who learns another user's ID could read or change their deadlines. This is a reasonable tradeoff for a no-accounts class project, but it would be worth mentioning in the README as a known limitation, or adding optional sign-in in the future.

2. **Data is tied to a single browser.** If a user clears their browser data or switches devices, their deadlines appear to be lost. A "recovery code" (showing the owner ID so it can be entered on another device) or an export option would protect users from losing important deadlines.

3. **Protect against XSS on the Tips board.** Since tips are user-generated and shown to everyone, make sure tip titles and text are rendered with `textContent` (or by creating elements) rather than `innerHTML`, so posted HTML or scripts can't run in other users' browsers.

4. **Consider deadline reminders.** The tracker shows urgency only when the user visits the page. An "Add to calendar" (.ics) download for each deadline would let students get reminders in the calendar app they already use.

5. **Add a way to flag tips.** Because tips are unverified, a "Report" or "Outdated" button would help the community catch incorrect advice, and a "Helpful" count could surface the best tips.

6. **Pagination for tips.** With about 1,000 seeded tips, loading everything at once could slow the page as the board grows. Adding a limit with "Load more" or pagination would keep it fast.

7. **Accessibility details.** Make sure the urgency status is also shown in text (not only red or amber color) for color-blind users, and consider adding `aria-pressed` to the process filter buttons so screen readers announce which filter is active.

---

## Alignment with Project Proposal

The app matches the objective stated in the README and design document: a personal deadline tracker plus a community tips board for international students. Both features are fully implemented with create, read, update, and delete operations, filtering by process works as described, and the no-accounts approach with an anonymous browser ID is consistent with the stated design. The work is clearly divided between the two authors, with each owning one collection, its API, and its page.

---

## Additional Observations

- **Broken demo video link in the README.** `[** Demo Video] (https://youtu.be/n9HSurIN_rw)` doesn't render as a link because of the space between `]` and `(` and the extra `**`. It should be `[Demo Video](https://youtu.be/n9HSurIN_rw)`.
- **Missing links.** "Presentation" and "Presentation Video" in the Links section don't appear to link anywhere yet.
- **Deployment.** The app is live on Vercel and the pages load quickly with consistent navigation across Home, My Deadlines, and Tips.

---

## Conclusion

Paperwork Pal is a well-built, practical project with a clear audience and a clean codebase. The main areas to strengthen are the limitations of browser-based identity (data loss and impersonation), XSS protection on user-generated tips, and a few README fixes. Great work overall. This is a tool many international students would genuinely find useful.
