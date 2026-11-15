import Database from "better-sqlite3";
import { MongoClient } from "mongodb";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sqlitePath = path.join(repoRoot, "sqlite.db");
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_DB || "bazar_dor";

if (!mongoUri) {
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

if (!fs.existsSync(sqlitePath)) {
  console.error(`SQLite database not found at ${sqlitePath}`);
  process.exit(1);
}

const backupPath = path.join(repoRoot, `sqlite.db.backup-${new Date().toISOString().replace(/[:.]/g, "-")}`);
fs.copyFileSync(sqlitePath, backupPath);
console.log(`SQLite backup created at ${backupPath}`);

const sqlite = new Database(sqlitePath, { readonly: true });
const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});

const tables = ["user", "account", "session", "verification"];

async function main() {
  await client.connect();
  const db = client.db(mongoDbName);

  for (const table of tables) {
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
    if (!rows.length) {
      console.log(`No rows found in ${table}; skipping.`);
      continue;
    }

    const collection = db.collection(table);
    const transformed = rows.map((row) => ({
      ...row,
      _id: row.id,
      ...(row.emailVerified !== undefined ? { emailVerified: Boolean(row.emailVerified) } : {}),
    }));

    await collection.deleteMany({});
    await collection.insertMany(transformed);
    console.log(`Migrated ${transformed.length} rows into ${mongoDbName}.${table}`);
  }

  const counts = {};
  for (const table of tables) {
    counts[table] = await db.collection(table).countDocuments();
  }

  console.log("Record counts:", counts);
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await client.close();
  });
