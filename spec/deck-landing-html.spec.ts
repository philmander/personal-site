import { test } from 'node:test';
import assert from 'node:assert';
import deckLandingHtml from '../src/sites/deck-landing-html.ts';

test('landing links are root-relative on deck.dj itself', () => {
  const html = deckLandingHtml();
  assert.match(html, /class="brand" href="\/"/);
  assert.match(html, /href="\/support"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.dj\/">/);
  assert.match(html, /content="https:\/\/deck\.dj\/static\/deck\/hero\.jpg"/);
});

test('basePath prefixes internal links when served under safestudios.nl/deck', () => {
  const html = deckLandingHtml({ basePath: '/deck', origin: 'https://safestudios.nl' });
  assert.match(html, /class="brand" href="\/deck\/"/);
  assert.match(html, /href="\/deck\/support"/);
  assert.match(html, /href="\/deck\/privacy"/);
  // static assets and same-page anchors need no prefix
  assert.match(html, /src="\/static\/deck\/hero\.jpg"/);
  assert.match(html, /href="#setup"/);
  // canonical still points at the permanent home
  assert.match(html, /<link rel="canonical" href="https:\/\/deck\.dj\/">/);
  assert.match(html, /content="https:\/\/safestudios\.nl\/static\/deck\/hero\.jpg"/);
});

test('landing renders all sections of the design', () => {
  const html = deckLandingHtml();
  assert.match(html, /No CDJ, no problem\./);
  assert.match(html, /One cable between your phone and the mix\./);
  assert.match(html, /Professional controls\. Super low latency\./);
  assert.strictEqual(html.match(/class="feature"/g)?.length, 9);
  assert.strictEqual(html.match(/<button class="shot-thumb/g)?.length, 5);
  assert.match(html, /Turn a spare device into your next deck\./);
  // Play links out; the App Store badge opens the coming-soon dialog
  assert.match(html, /href="https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.philmander\.deck"/);
  assert.match(html, /js-coming-soon/);
  assert.match(html, /Deck for iOS is on its way to the App Store/);
  assert.doesNotMatch(html, /href="https:\/\/apps\.apple\.com/);
});
