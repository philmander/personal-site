import { test } from 'node:test';
import assert from 'node:assert';
import siteForHost from '../src/sites/site-for-host.ts';

test('deck.dj maps to the deck site', () => {
  assert.strictEqual(siteForHost('deck.dj'), 'deck');
  assert.strictEqual(siteForHost('www.deck.dj'), 'deck');
  assert.strictEqual(siteForHost('Deck.DJ'), 'deck');
  assert.strictEqual(siteForHost('deck.localhost'), 'deck');
});

test('safestudios.nl maps to the safestudios site', () => {
  assert.strictEqual(siteForHost('safestudios.nl'), 'safestudios');
  assert.strictEqual(siteForHost('www.safestudios.nl'), 'safestudios');
  assert.strictEqual(siteForHost('safestudios.localhost'), 'safestudios');
});

test('philmander.com and anything unrecognized map to the personal site', () => {
  assert.strictEqual(siteForHost('philmander.com'), 'philmander');
  assert.strictEqual(siteForHost('www.philmander.com'), 'philmander');
  assert.strictEqual(siteForHost('localhost'), 'philmander');
  assert.strictEqual(siteForHost('127.0.0.1'), 'philmander');
  assert.strictEqual(siteForHost('something-else.example'), 'philmander');
});
