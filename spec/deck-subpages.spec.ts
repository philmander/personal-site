import { test } from 'node:test';
import assert from 'node:assert';
import deckSupportHtml from '../src/sites/deck-support-html.ts';
import deckPrivacyHtml from '../src/sites/deck-privacy-html.ts';

test('support page renders the design content with canonical', () => {
  const html = deckSupportHtml();
  assert.match(html, /<title>Support — Deck<\/title>/);
  assert.match(html, /How can we help\?/);
  assert.match(html, /mailto:support@safestudios\.nl/);
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.dj\/support">/);
  assert.match(html, /&larr; Back to Deck/);
});

test('privacy page keeps the newer policy revision over the stale comp text', () => {
  const html = deckPrivacyHtml();
  assert.match(html, /<title>Privacy — Deck<\/title>/);
  assert.match(html, /Last Updated: July 19, 2026/);
  assert.match(html, /on both Android and iOS/);
  assert.match(html, /file and folder access you grant on iOS/);
  assert.match(html, /mailto:support@safestudios\.nl/);
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.dj\/privacy">/);
});

test('subpage links honor basePath under safestudios.nl/deck', () => {
  const html = deckPrivacyHtml({ basePath: '/deck', origin: 'https://safestudios.nl' });
  assert.match(html, /class="brand" href="\/deck\/"/);
  assert.match(html, /class="back-link" href="\/deck\/"/);
  assert.match(html, /href="\/deck\/support"/);
  assert.match(html, /content="https:\/\/safestudios\.nl\/static\/deck\/hero\.jpg"/);
});
