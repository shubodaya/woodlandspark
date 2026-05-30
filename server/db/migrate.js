import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { db } from "./connection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "..", "migrations");

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const applied = new Set(db.prepare("SELECT name FROM migrations").all().map((row) => row.name));
const files = readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

for (const file of files) {
  if (applied.has(file)) continue;
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  const run = db.transaction(() => {
    db.exec(sql);
    db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
  });
  run();
  console.log(`Applied migration: ${file}`);
}

console.log("Database migrations complete.");
