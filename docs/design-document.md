# Paperwork Pal: Design Document

## Project description

Paperwork Pal helps international students in the US keep track of the immigration and tax deadlines that can put their status at risk if missed. Official sites explain the rules but not what the process is really like, and generic calendar apps know nothing about these deadlines.

The app has two parts:

- **My Deadlines**: a personal tracker. A student adds each deadline with its document type, due date, and notes, and sees them sorted by urgency with the days remaining.
- **Tips**: a community board where students who have been through a process share what they wish they had known. Tips are public to read, labeled unverified, and are not legal advice.

There is no login. Each browser generates an anonymous ID on first visit and sends it with every request, so users see and edit only their own deadlines and tips.

### Team and work division

| Member                        | Feature   | Collection  | Scope                                                                  |
| ----------------------------- | --------- | ----------- | ---------------------------------------------------------------------- |
| Ashwin Bhat                   | Deadlines | `deadlines` | Deadline CRUD, sorted view with days remaining, status updates         |
| Mohammed Sameer Sarfaraz Bake | Tips      | `tips`      | Tip CRUD (public read, author-only edit and delete), filter by process |

Each of us builds the full stack for our own feature: MongoDB collection, Express routes, and vanilla JavaScript frontend.

### Tech stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript (ES modules), Fetch API, client-side rendering
- **Backend:** Node.js and Express
- **Database:** MongoDB with the native Node.js driver
- **Deployment:** Vercel, with MongoDB Atlas

## User personas

### Mei, an F-1 student

Mei is a master's student about to apply for OPT. Her program end date, her DSO's OPT recommendation, her I-765 filing window, and her first US tax filing all land within a few months of each other. She keeps track of them across emails, a notes app, and a university portal, and she is afraid of missing a window she won't get back.

- **Goal:** one place that shows what is due soon and how much time is left.
- **Frustration:** generic calendars don't know which forms matter, and the official pages don't say what to do first.

### Arjun, a recent graduate

Arjun finished his degree last year and is now working on OPT. He made several avoidable mistakes along the way, such as waiting too long to request his DSO recommendation and not knowing he had to file Form 8843 in a year with no income.

- **Goal:** share what he learned so newer students don't repeat his mistakes.
- **Frustration:** advice is scattered across group chats and gets lost.

## User stories

### Deadlines (Ashwin)

#### 1. Add a deadline

> As Mei, I want to add a deadline with a document type, due date, and notes, so I can keep everything I need to file in one place.

Mei's DSO tells her she has to request an OPT recommendation before she can file Form I-765. She opens **My Deadlines**, picks "OPT application" from the document type list, enters the date she is aiming for, and writes "Need DSO recommendation first" in the notes. The deadline appears in her list right away, without a page reload.

- Document type comes from a fixed list (OPT application, STEM OPT extension, I-20 travel signature, Form 8843, federal and state tax returns, visa renewal, SEVP address update, other).
- Due date is required. Notes are optional.
- The deadline is stored under Mei's anonymous ID and nobody else can see it.

#### 2. See deadlines sorted by urgency

> As Mei, I want to see my deadlines sorted by due date with the days remaining, so I can spot the most urgent one.

On Monday morning Mei opens the page. Her deadlines are listed soonest first. Each card shows how many days are left, or how many days late it is. Overdue deadlines are marked red and deadlines due within a week are marked amber, so she sees at a glance that her OPT application is three days past the date she set and that Form 8843 is due Thursday.

- Sorted by due date, ascending.
- Days remaining are counted in calendar days from the user's local date.
- A summary at the top counts overdue deadlines and deadlines due this week.

#### 3. Update or delete a deadline

> As Mei, I want to update a deadline's status or delete it, so my list stays accurate.

After she mails Form 8843, Mei changes its status from "Not started" to "Submitted", and the card fades so it no longer competes for attention. Later she notices she entered her state tax return twice, so she deletes the duplicate after confirming. When her DSO moves her travel signature appointment, she clicks **Edit**, changes the date, and saves.

- Status is one of: Not started, In progress, Submitted. Changing it saves immediately.
- **Edit** loads the deadline into the form, so every field can be changed.
- **Delete** asks for confirmation first.

### Tips (Sameer)

#### 4. Post a tip

> As Arjun, I want to post a tip about a specific process, so newer students can avoid my mistakes.

#### 5. Browse and filter tips

> As Mei, I want to browse and filter tips by process (OPT, I-20, taxes), so I can find advice relevant to what I'm doing now.

#### 6. Edit or delete my own tips

> As Arjun, I want to edit or delete my own tips, so I can fix or remove outdated advice.

## Data model

### `deadlines`

| Field          | Type     | Notes                                                                      |
| -------------- | -------- | -------------------------------------------------------------------------- |
| `_id`          | ObjectId |                                                                            |
| `ownerId`      | string   | Anonymous browser ID                                                       |
| `documentType` | string   | One of the fixed document types                                            |
| `dueDate`      | string   | `YYYY-MM-DD`, kept as a date-only string so time zones can't shift the day |
| `status`       | string   | `not started`, `in progress`, or `submitted`                               |
| `notes`        | string   | Optional                                                                   |
| `createdAt`    | Date     |                                                                            |
| `updatedAt`    | Date     |                                                                            |

Indexed on `{ ownerId: 1, dueDate: 1 }`, which serves the sorted list query.

### Deadlines API

All routes require the `X-Owner-Id` header and only touch that owner's deadlines.

| Method   | Route                | Purpose                           |
| -------- | -------------------- | --------------------------------- |
| `GET`    | `/api/deadlines`     | List deadlines sorted by due date |
| `POST`   | `/api/deadlines`     | Create a deadline                 |
| `PATCH`  | `/api/deadlines/:id` | Update status or any other field  |
| `DELETE` | `/api/deadlines/:id` | Delete a deadline                 |

## Design mockups

### Landing page

![Landing page](../assets/images/landing.png)

### My Deadlines

![My Deadlines page](../assets/images/deadlines.png)

### Editing a deadline

![Editing a deadline](../assets/images/editing.png)

### No deadlines yet

![Empty deadlines list](../assets/images/empty.png)

### Deleting a deadline

![Delete confirmation](../assets/images/delete.png)
