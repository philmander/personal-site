import { test } from 'node:test';
import assert from 'node:assert';
import ConnectionParameters from 'pg/lib/connection-parameters.js';
import { splitSslParams } from '../src/db.ts';

const DO_URL = 'postgresql://user:pass@db-foo.b.db.ondigitalocean.com:25060/deck?sslmode=require';

test('sslmode is stripped so it cannot override the explicit ssl option', () => {
  const { connectionString, wantsTls } = splitSslParams(DO_URL);
  assert.ok(wantsTls);
  assert.ok(!connectionString.includes('sslmode'));

  // The regression that kept breaking prod (SELF_SIGNED_CERT_IN_CHAIN):
  // with sslmode in the URL, pg replaces the explicit ssl option with
  // full system-CA verification ({}).
  const clobbered = new ConnectionParameters({ connectionString: DO_URL, ssl: { rejectUnauthorized: false } });
  assert.deepStrictEqual(clobbered.ssl, {});

  // With the cleaned URL the explicit ssl option survives.
  const fixed = new ConnectionParameters({ connectionString, ssl: { rejectUnauthorized: false } });
  assert.deepStrictEqual(fixed.ssl, { rejectUnauthorized: false });
});

test('DO hosts want TLS even without sslmode; local URLs do not', () => {
  const bare = splitSslParams('postgresql://user:pass@db-foo.b.db.ondigitalocean.com:25060/deck');
  assert.strictEqual(bare.wantsTls, true);

  const local = splitSslParams('postgresql://postgres:postgres@localhost:5432/deck');
  assert.strictEqual(local.wantsTls, false);

  const disabled = splitSslParams('postgresql://user:pass@somehost:5432/deck?sslmode=disable');
  assert.strictEqual(disabled.wantsTls, false);
});

test('other query params survive the strip', () => {
  const { connectionString } = splitSslParams(DO_URL + '&application_name=personal-site');
  assert.strictEqual(
    connectionString,
    'postgresql://user:pass@db-foo.b.db.ondigitalocean.com:25060/deck?application_name=personal-site',
  );
});
