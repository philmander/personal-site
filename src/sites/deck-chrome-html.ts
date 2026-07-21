/**
 * Chrome fragments shared by every deck page (landing, support, privacy):
 * head meta, brand, footer. Content per the Claude Design comps.
 */

export const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.philmander.deck';

export function deckHeadHtml({
  title,
  description,
  origin,
  path,
}: { title: string; description: string; origin: string; path: string }): string {
  return `<meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${origin}/static/deck/hero.jpg">
    <link rel="canonical" href="https://deck.dj${path === '/' ? '/' : path}">
    <meta name="theme-color" content="#0a0a0c">
    <link rel="icon" href="/static/deck/icon.png">
    <link rel="apple-touch-icon" href="/static/deck/icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="/static/deck/deck.css" rel="stylesheet">`;
}

export function deckBrandHtml(basePath: string): string {
  return `<a class="brand" href="${basePath}/">
        <img src="/static/deck/icon.png" alt="" width="38" height="38">
        <span>Deck — Pro Audio Player for DJs</span>
      </a>`;
}

export function deckFooterHtml(basePath: string): string {
  return `<footer class="footer">
      <span>Deck &mdash; a standalone DJ deck for your phone or tablet</span>
      <div class="footer-links">
        <a href="${basePath}/support">Support</a>
        <a href="${basePath}/privacy">Privacy</a>
        <span>&copy; 2026 Deck</span>
      </div>
    </footer>`;
}
