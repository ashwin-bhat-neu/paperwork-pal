import { MongoClient } from "mongodb";

const DATABASE_NAME = "paperworkPal";

// Cached at module scope so warm serverless invocations reuse one connection.
let connectedClientPromise;

function connectClient() {
  const connectionString = process.env.MONGODB_URI;
  if (!connectionString) {
    throw new Error("MONGODB_URI is not set; copy .env.example to .env");
  }
  return new MongoClient(connectionString).connect().catch((error) => {
    connectedClientPromise = undefined;
    throw error;
  });
}

export async function getDatabase() {
  connectedClientPromise ??= connectClient();
  const client = await connectedClientPromise;
  return client.db(DATABASE_NAME);
}

// Only scripts need this; the server keeps its connection for its whole lifetime.
export async function closeDatabaseConnection() {
  if (!connectedClientPromise) {
    return;
  }
  const client = await connectedClientPromise;
  connectedClientPromise = undefined;
  await client.close();
}
