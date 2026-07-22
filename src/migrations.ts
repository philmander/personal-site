import { sql } from 'kysely';
import type { Kysely } from 'kysely';
import type { Migration } from 'kysely/migration';

/**
 * Schema migrations, applied in key order by src/migrate.ts. Defined in
 * code rather than as a migrations directory so they ship inside the
 * Docker image with no filesystem lookup — add new entries with a later
 * date prefix and never edit an applied one.
 */
export const migrations: Record<string, Migration> = {
  '2026-07-22-create-feedback': {
    async up(db: Kysely<unknown>): Promise<void> {
      await db.schema
        .createTable('feedback')
        // uuidv7() is native to Postgres 18: time-ordered, index-friendly
        .addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`uuidv7()`))
        .addColumn('name', 'text', col => col.notNull())
        .addColumn('email', 'text', col => col.notNull())
        .addColumn('message', 'text', col => col.notNull())
        .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
        .execute();
    },
    async down(db: Kysely<unknown>): Promise<void> {
      await db.schema.dropTable('feedback').execute();
    },
  },
};
