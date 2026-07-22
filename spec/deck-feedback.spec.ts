import { test } from 'node:test';
import assert from 'node:assert';
import deckFeedbackHtml from '../src/sites/deck-feedback-html.ts';
import { validateFeedback, feedbackFromBody } from '../src/feedback-service.ts';

test('feedback page renders the form with honeypot and canonical', () => {
  const html = deckFeedbackHtml();
  assert.match(html, /<title>Feedback — Deck<\/title>/);
  assert.match(html, /<form class="feedback-form" method="post" action="\/feedback">/);
  assert.match(html, /name="name"/);
  assert.match(html, /name="email"/);
  assert.match(html, /name="message"/);
  assert.match(html, /name="website"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.dj\/feedback">/);
});

test('form action honors basePath under safestudios.nl/deck', () => {
  const html = deckFeedbackHtml({ basePath: '/deck', origin: 'https://safestudios.nl' });
  assert.match(html, /action="\/deck\/feedback"/);
  assert.match(html, /class="back-link" href="\/deck\/"/);
});

test('sent state shows confirmation instead of the form', () => {
  const html = deckFeedbackHtml({ sent: true });
  assert.match(html, /Message sent/);
  assert.match(html, /Thanks &mdash; got it\./);
  assert.doesNotMatch(html, /<form/);
});

test('re-rendered form escapes previous values and shows errors', () => {
  const html = deckFeedbackHtml({
    values: { name: '<script>alert(1)</script>', email: 'not-an-email', message: 'hi' },
    errors: { email: "That doesn't look like an email address." },
  });
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /class="form-error"/);
  assert.match(html, /value="not-an-email"/);
});

test('save failure shows the mailto fallback above the form', () => {
  const html = deckFeedbackHtml({
    values: { name: 'A', email: 'a@b.cd', message: 'hi' },
    saveFailed: true,
  });
  assert.match(html, /class="form-fail"/);
  assert.match(html, /mailto:support@safestudios\.nl/);
  assert.match(html, /<form/);
});

test('validation accepts a normal submission', () => {
  const errors = validateFeedback({
    name: 'Phil',
    email: 'phil@example.com',
    message: 'Loving the loop controls.',
  });
  assert.deepEqual(errors, {});
});

test('validation flags empty fields and bad email', () => {
  const errors = validateFeedback({ name: '', email: 'nope', message: '' });
  assert.ok(errors.name);
  assert.ok(errors.email);
  assert.ok(errors.message);
});

test('validation caps oversized fields', () => {
  const errors = validateFeedback({
    name: 'a'.repeat(201),
    email: 'a@b.cd',
    message: 'a'.repeat(5001),
  });
  assert.ok(errors.name);
  assert.equal(errors.email, undefined);
  assert.ok(errors.message);
});

test('feedbackFromBody trims strings and drops non-strings', () => {
  const input = feedbackFromBody({ name: '  Phil ', email: ['x'], message: '\nhi\n' });
  assert.deepEqual(input, { name: 'Phil', email: '', message: 'hi' });
});
