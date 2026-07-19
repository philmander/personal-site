interface DeckPageOptions {
  title?: string;
  description?: string;
  main: string;
}

export default function deckPageHtml({
  title = 'Deck — Audio player for DJs',
  description = 'A professional DJ deck for your phone. Instant cues, beat-quantized loops, vinyl-real scratching. No ads, no subscriptions, no data collected.',
  main,
}: DeckPageOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="https://deck.dj/static/deck/hero.png">
    <meta name="theme-color" content="#0b0c0f">
    <link rel="icon" href="/static/deck/icon.png">
    <link rel="apple-touch-icon" href="/static/deck/icon.png">
    <link href="/static/deck/styles.css" rel="stylesheet">
  </head>
  <body>
    <div class="page">
      <header class="site-header">
        <a class="brand" href="/">
          <img src="/static/deck/icon.png" alt="" width="36" height="36">
          <span>Deck</span>
        </a>
        <nav>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </header>
      <main>
        ${main}
      </main>
      <footer class="site-footer">
        <p>&copy; 2026 Safe Studios &middot; Amsterdam</p>
        <nav>
          <a href="/support">Support</a>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </footer>
    </div>
  </body>
</html>`;
}
