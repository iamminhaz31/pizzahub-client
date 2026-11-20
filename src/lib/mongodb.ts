import dns from "dns";
import { MongoClient } from "mongodb";

// Local development fix: some ISPs block SRV DNS lookups used by mongodb+srv.
// Skipped in production (Vercel), where DNS works normally.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

const client = global._mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global._mongoClient = client;
}

export const db = client.db(process.env.DB_NAME || "pizzahub");
export { client };