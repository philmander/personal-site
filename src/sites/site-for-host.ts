export type Site = 'philmander' | 'safestudios' | 'deck';

/**
 * Maps a request hostname to one of the three sites this server hosts.
 * philmander.com is the default, so localhost and any unrecognized host
 * keep working as before. For local development the *.localhost names
 * resolve to 127.0.0.1 in every modern browser:
 *   http://deck.localhost:3000, http://safestudios.localhost:3000
 */
export default function siteForHost(hostname: string): Site {
  const host = hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'deck.dj' || host === 'deck.localhost') {
    return 'deck';
  }
  if (host === 'safestudios.nl' || host === 'safestudios.localhost') {
    return 'safestudios';
  }
  return 'philmander';
}
