
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("mongodb+srv://minhajultanjil143_db_user:e5NvWH1EJZYDZgR0@pizzahubcluster.uxyqnp0.mongodb.net/");
}

const client = new MongoClient(uri);

export const db = client.db(
  process.env.MONGODB_DB_NAME || "myapp"
);
