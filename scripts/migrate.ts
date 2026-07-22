/**
 * Manual migration runner — the app also migrates automatically at startup,
 * this is for applying migrations from a laptop (needs the DB's Trusted
 * Sources to allow your IP):
 *
 *   npm run db:migrate
 */
import { migrateToLatest } from '../src/migrate.ts';
import { getDb } from '../src/db.ts';

const ok = await migrateToLatest();
await getDb().destroy();
process.exit(ok ? 0 : 1);
