import { Migrator } from 'kysely/migration';
import { migrations } from './migrations.ts';
import { getDb } from './db.ts';
import { logger } from './logger.ts';

/**
 * Apply all pending migrations. Kysely tracks applied migrations in a
 * kysely_migration table and serializes concurrent runs through a
 * kysely_migration_lock row, so parallel app instances during a rolling
 * deploy can't both apply the same migration.
 */
export async function migrateToLatest(): Promise<boolean> {
  const migrator = new Migrator({
    db: getDb(),
    provider: { getMigrations: async () => migrations },
  });

  const { error, results } = await migrator.migrateToLatest();
  for (const result of results ?? []) {
    logger.info({ migration: result.migrationName, status: result.status }, 'Migration');
  }
  if (error) {
    logger.error({ err: error }, 'Migrations failed');
    return false;
  }
  return true;
}
