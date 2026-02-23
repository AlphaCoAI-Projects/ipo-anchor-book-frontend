import { MongoClient, Db, Collection } from "mongodb";

// ─── Singleton MongoDB client for Next.js ─────────────────────────────────────
// Next.js hot-reloads in dev, so we cache the client on the global object
// to avoid creating a new connection on every hot-reload.

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME     = process.env.MONGODB_DB     || "quant-replica";
const COLL_NAME   = process.env.MONGODB_COLLECTION || "anchor_book-replica";

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

// Module-level cache
let cachedClient: MongoClient | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export async function getCollection(): Promise<Collection> {
  const client = await getMongoClient();
  const db: Db = client.db(DB_NAME);
  return db.collection(COLL_NAME);
}
