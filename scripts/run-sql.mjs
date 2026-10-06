// Runs one or more SQL files against the Supabase database, each in a transaction.
// Usage: npm run db:sql -- supabase/migrations/0003_push_subscriptions.sql
// Needs SUPABASE_DB_URL in .env.local (Supabase > Connect > Session pooler).
import { readFileSync } from "node:fs";
import pg from "pg";

process.loadEnvFile?.(".env.local");

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL is not set in .env.local");
  process.exit(1);
}
const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Pass at least one .sql file");
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  for (const file of files) {
    const sql = readFileSync(file, "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      // Make the API (PostgREST) see new tables right away.
      await client.query("notify pgrst, 'reload schema'");
      await client.query("commit");
      console.log(`Applied ${file}`);
    } catch (err) {
      await client.query("rollback");
      console.error(`Failed ${file}: ${err.message}`);
      process.exitCode = 1;
      break;
    }
  }
} finally {
  await client.end();
}
