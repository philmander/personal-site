import { test } from 'node:test';
import assert from 'node:assert';
import { basicAuthPasses } from '../src/admin-auth.ts';
import feedbackAdminHtml from '../src/sites/feedback-admin-html.ts';
import type { FeedbackRow } from '../src/sites/feedback-admin-html.ts';

function header(user: string, pass: string): string {
  return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
}

test('basicAuthPasses accepts the right password with any username', () => {
  assert.equal(basicAuthPasses(header('admin', 'hunter2'), 'hunter2'), true);
  assert.equal(basicAuthPasses(header('whoever', 'hunter2'), 'hunter2'), true);
});

test('basicAuthPasses rejects wrong or missing credentials', () => {
  assert.equal(basicAuthPasses(header('admin', 'wrong'), 'hunter2'), false);
  assert.equal(basicAuthPasses(undefined, 'hunter2'), false);
  assert.equal(basicAuthPasses('Bearer abc', 'hunter2'), false);
  assert.equal(basicAuthPasses(header('admin', ''), 'hunter2'), false);
});

test('basicAuthPasses rejects everything when no password is configured', () => {
  assert.equal(basicAuthPasses(header('admin', 'hunter2'), undefined), false);
  assert.equal(basicAuthPasses(header('admin', ''), ''), false);
});

test('basicAuthPasses handles passwords containing colons', () => {
  assert.equal(basicAuthPasses(header('admin', 'a:b:c'), 'a:b:c'), true);
});

const ROW: FeedbackRow = {
  id: '01890000-0000-7000-8000-000000000000',
  name: 'Phil',
  email: 'phil@example.com',
  message: 'Loving the loop controls.\nMore FX please.',
  created_at: new Date('2026-07-22T12:00:00Z'),
};

test('admin page renders entries newest-first content with noindex', () => {
  const html = feedbackAdminHtml([ROW]);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /1 message</);
  assert.match(html, /Phil/);
  assert.match(html, /mailto:phil@example\.com/);
  assert.match(html, /Loving the loop controls\./);
});

test('admin page escapes hostile submissions', () => {
  const html = feedbackAdminHtml([{ ...ROW, name: '<img onerror=x>', message: '<script>' }]);
  assert.match(html, /&lt;img onerror=x&gt;/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});

test('admin page shows an empty state', () => {
  const html = feedbackAdminHtml([]);
  assert.match(html, /0 messages/);
  assert.match(html, /No feedback yet\./);
});
