# Paperwork Pal

Immigration and tax deadline tracker and community tips board for international students in the US.

See the [design document](docs/design-document.md) for personas, user stories, and mockups.

## Running locally

Requires Node.js 22 or newer and a MongoDB connection string (a free MongoDB Atlas cluster works).

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI
npm run dev
```

The app runs at http://localhost:3000. `GET /api/health` confirms the database connection.

Before committing, run `npm run lint` and `npm run format`.
