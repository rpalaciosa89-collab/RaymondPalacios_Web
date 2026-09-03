import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const sql = fs.readFileSync('database/migrations/001_initial.sql', 'utf8');
const contactApi = fs.readFileSync('api/contact.js', 'utf8');
const shared = fs.readFileSync('api/_shared.js', 'utf8');
const client = fs.readFileSync('script.js', 'utf8');

test('RLS is enabled and browser roles are revoked', () => {
  for (const table of ['leads', 'project_access', 'contact_messages', 'privacy_requests', 'rate_limits']) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, 'i'));
  }
  assert.match(sql, /revoke all on public\.leads,public\.project_access,public\.contact_messages,public\.privacy_requests,public\.rate_limits from anon,authenticated/i);
});

test('contact endpoint validates consent and uses rate limiting', () => {
  assert.match(contactApi, /privacy_consent!==true/);
  assert.match(contactApi, /rateLimit\(req,'contact'/);
});

test('server normalizes email and rejects unexpected properties', () => {
  assert.match(shared, /trim\(\)\.toLowerCase\(\)/);
  assert.match(shared, /unexpected_property/);
});

test('browser never stores private email or session tokens', () => {
  assert.doesNotMatch(client, /sessionStorage\.setItem\('rp-project-access-token'/);
  assert.doesNotMatch(client, /localStorage\.setItem\([^,]*email/i);
});

test('frontend preserves form entries on network error', () => {
  const resetCalls = [...client.matchAll(/form\.reset\(\)/g)].length;
  assert.equal(resetCalls, 1, 'only successful contact submission should reset a form');
  assert.match(client, /catch\(error\).*contact\.form\.error/s);
});
