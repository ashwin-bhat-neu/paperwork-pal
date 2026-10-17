import path from "node:path";
import express from "express";
import { getDatabase } from "./db/connection.js";
import {
  handleUnexpectedError,
  handleUnknownApiRoute,
} from "./middleware/errorHandlers.js";

const app = express();

app.use(express.json());
// Vercel ignores this and serves public/ from its CDN; it is for local runs.
app.use(express.static(path.join(import.meta.dirname, "public")));

app.get("/api/health", async (request, response) => {
  const database = await getDatabase();
  await database.command({ ping: 1 });
  response.json({ status: "ok" });
});

app.use("/api", handleUnknownApiRoute);
app.use(handleUnexpectedError);

export default app;
