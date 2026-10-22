# Peer Review — Paperwork Pal

**Reviewer:** Alejandra Aimee Rivas Montes  
**Project:** Paperwork Pal  
**Developers:** Ashwin Bhat and Mohammed Sameer Sarfaraz Bake  
**Course:** CS 5610 — Web Development, Fall 2026

## 1. Overall Assessment

Paperwork Pal is a useful application that addresses a real challenge for international students: keeping track of immigration and tax deadlines while learning from the experiences of other students.

After reviewing the project proposal, documentation, and available source code, the application appears to address all six proposed user stories through two independent features: My Deadlines and Tips.

The project demonstrates a clear separation between the frontend, backend, and database layers, with CRUD functionality for both MongoDB collections.

As an international studen,I particularly appreciate the project's focus on usability, privacy, and clear communication about the limitations of community-submitted information.

The following feedback highlights five positive aspects of the implementation, followed by suggestions that could improve the user experience as the application grows.

---

## 2. Positive Feedback

### 2.1 Clear Onboarding and User Guidance

**File:** `public/index.html`  
**Line:** 69 — "How to use it" section

I really like the "How to use it" section on the homepage. It clearly explains the main features and helps first-time users understand how to get started without needing additional instructions. Great attention to usability!

### 2.2 Responsible Handling of Community Information

**File:** `public/tips.html`  
**Line:** 49 — Disclaimer

I appreciate the clear disclaimer explaining that community tips are unverified and should not be considered legal advice. Since the application deals with immigration and tax-related topics, this is an important design decision that helps users understand the limitations of the information provided.

### 2.3 Thoughtful Ownership Checks for Tips

**File:** `routes/tips.js`  
**Line:** 47 — Tip ownership handling

Nice implementation of the ownership checks for editing tips! I especially like that the API is designed to return a 404 when a tip does not exist or does not belong to the current user. This avoids exposing unnecessary information and keeps the authorization logic consistent.

### 2.4 Reusable Middleware for Personal Deadlines

**File:** `routes/deadlines.js`  
**Line:** 16 — `deadlinesRouter.use(requireOwnerId)`

I like how the owner identification middleware is applied to the entire deadlines router. This keeps the code clean and avoids repeating the same check in every endpoint. It is also consistent with the project's goal of keeping each user's deadlines separate.

### 2.5 Responsive Design and CSS Organization

**File:** `public/css/tips/tipsPage.css`  
**Line:** 8 — Responsive layout media query

Great use of CSS Grid and media queries to make the Tips page responsive! I also like how the styles are organized into reusable and page-specific files. This makes the layout easier to maintain without relying on a CSS framework.

---

## 3. Suggestions for Improvement

The following suggestions are intended as potential enhancements rather than missing requirements from the approved project proposal.

### 3.1 Add Search and Pagination to Tips

**Area:** Tips page

The process filters are useful for narrowing down the list of tips. However, it can still be difficult to find specific information when many tips belong to the same category.

Adding keyword search by title or content, along with pagination, would make the Tips section easier to navigate as the number of contributions grows.



### 3.2 Add a "My Tips" Filter

**Area:** Tips page

I like that users can identify their own contributions through the "Your tip" label and edit or delete them.

An additional "My Tips" filter would make it much easier to locate previously submitted contributions, especially when newer tips push older ones farther down the page.

### 3.3 Separate Submitted Deadlines from Active Deadlines

**Area:** My Deadlines page

The ability to update a deadline's status is very helpful. However, displaying submitted deadlines alongside tasks that still require action can create unnecessary visual clutter.

Separating them into "Active" and "Submitted" sections, or providing a filter to hide completed tasks, would help users focus on upcoming deadlines while preserving their history.


### 3.4 Offer an Optional Calendar View

**Area:** My Deadlines page

While the current list provides useful information, a monthly calendar could make it easier to visualize upcoming deadlines and understand how they are distributed over time.

Offering a toggle between List View and Calendar View would give users more flexibility when planning their activities.

This could work particularly well alongside the option to hide submitted deadlines.


### 3.5 Allow Users to Export and Import Their Deadlines

**Area:** My Deadlines / Data management

Since the application intentionally uses browser-based anonymous identification instead of user accounts, it would be helpful to offer an option to export and import personal deadlines.

This would allow users to back up their information and recover it if they switch devices or clear their browser data.

An additional option to export deadlines to a calendar format, such as `.ics`, could also be useful.

### 3.6 Detect Potentially Duplicate Tips

**Area:** Tips page / Data validation

I noticed a few tips with almost identical titles and content, even though they were posted on different dates.

One possible improvement would be to detect similar tips before allowing users to publish a new one.

Showing a warning or suggesting existing posts could help reduce duplicate information and keep the Tips section more organized.

This would not necessarily require blocking similar submissions, since students may have different experiences with the same process.

### 3.7 Clarify the "Unverified" Label

**Area:** Tips cards

I appreciate that community tips are clearly labeled as unverified.

One small improvement would be to add a tooltip explaining what "Unverified" means, so users understand that these tips have not been officially reviewed and should be confirmed with a qualified professional.

---

## 4. Alignment with the Approved Project Proposal

The original proposal defines six user stories, divided between two independently developed MongoDB collections.

| User Story | Proposed Functionality | Review Findings |
|---|---|---|
| US1 — Mei | Add deadlines with type, date, and notes | Form and CREATE endpoint implemented |
| US2 — Mei | Sort deadlines by due date and show days remaining | Documented; final interactive verification recommended |
| US3 — Mei | Update status or delete deadlines | API operations implemented; final interactive verification recommended |
| US4 — Arjun | Publish tips about specific processes | Implemented and exercised during review |
| US5 — Mei | Browse and filter tips by process | Implemented |
| US6 — Arjun | Edit or delete personal tips | Implemented; Edit and Delete tested successfully |

The project also follows its proposed technology choices: HTML5, CSS3, vanilla JavaScript, Node.js, Express, and MongoDB.

The anonymous browser identification mechanism is consistent with the approved proposal, which explicitly excludes traditional login accounts.

The "Unverified" label also fulfills a specific commitment from the original proposal.

Overall, the available evidence supports that the project has implemented its planned features. Some deadline-specific behaviors would benefit from additional interactive verification.

---

## 5. Additional Observations from Testing

During the review, I observed that newly submitted tips appear at the beginning of the list, which makes recent contributions easy to find.

I also tested the Edit and Delete functionality for tips, and both operations worked as expected.

The category filters provide a helpful starting point for discovering information about specific processes.

---

## 6. Conclusion

Overall, I think Paperwork Pal is a well-structured and thoughtful application that addresses a meaningful problem for international students.

The project demonstrates good organization, consistent interface design, clear data ownership rules, and useful CRUD functionality.

I especially appreciate the effort put into explaining the application to new users and clearly identifying community information as unverified.

My main recommendations focus on making the application easier to navigate as more information is added: improving search and pagination for Tips, organizing active and submitted deadlines, offering a calendar view, and providing a way to back up personal information.

These enhancements could make an already useful application even more practical for students managing important immigration and tax deadlines.

Great work on the project!
