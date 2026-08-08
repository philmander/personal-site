/**
 * The safestudios.nl homepage — implements the "2a · Dark, formal" comp
 * from the Claude Design project "Safe Studios homepage" (project
 * 8605aade-8bf9-498c-a9fe-d67bf19b3128; the handoff README there is the
 * source of truth). A formal, credible company presence: intro, the Deck
 * hero image, and legal/registration details.
 *
 * "Safe" is UK slang (good / sound) — nothing to do with security, hence
 * no shields or padlocks anywhere near this brand.
 */

const EMAIL = 'hello@safestudios.nl';

const DESCRIPTION = 'Safe Studios is a boutique software studio based in '
  + 'Amsterdam, Netherlands. We make Deck, an app which transforms your '
  + 'phone or tablet into a standalone DJ deck.';

/** The mark (short bar / tall bar / dot in fluorescent pink) as a favicon. */
const FAVICON = 'data:image/svg+xml,'
  + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">'
    + '<rect width="32" height="32" rx="7" fill="#16130f"/>'
    + '<rect x="7" y="13" width="4.5" height="9" rx="2.25" fill="#ff2e88"/>'
    + '<rect x="14" y="8" width="4.5" height="18" rx="2.25" fill="#ff2e88"/>'
    + '<rect x="21" y="15" width="4.5" height="4.5" rx="2.25" fill="#ff2e88"/>'
    + '</svg>');

export default function safestudiosLandingHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Safe Studios</title>
    <meta name="description" content="${DESCRIPTION}">
    <meta property="og:title" content="Safe Studios">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://safestudios.nl/">
    <meta property="og:image" content="https://safestudios.nl/static/deck/hero.jpg">
    <link rel="canonical" href="https://safestudios.nl/">
    <meta name="theme-color" content="#16130f">
    <link rel="icon" href="${FAVICON}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link href="/static/safestudios/safestudios.css" rel="stylesheet">
  </head>
  <body>
    <div class="wrap">
      <header class="site-head">
        <a class="logo" href="/">
          <span class="mark" aria-hidden="true"><span></span><span></span><span></span></span>
          <span class="wordmark">Safe Studios</span>
        </a>
        <a class="head-mail" href="mailto:${EMAIL}">${EMAIL}</a>
      </header>

      <main>
        <section class="intro">
          <p>Safe Studios is a boutique software studio based in Amsterdam, Netherlands.</p>
          <p>We make Deck, an app which transforms your phone or tablet into a standalone DJ deck.</p>
          <a class="deck-link" href="/deck">Find out more about Deck &rarr;</a>
        </section>

        <figure class="deck-figure">
          <div class="frame">
            <img src="/static/deck/hero.jpg" alt="Deck — DJ software by Safe Studios" fetchpriority="high">
          </div>
        </figure>
      </main>

      <footer>
        <div class="info">
          <div class="contact">
            <h2>Contact</h2>
            <a href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
          <div>
            <h2>Company</h2>
            <div>Safe Studios<br>Amsterdam, the Netherlands</div>
          </div>
          <div>
            <h2>Registration</h2>
            <div>KVK 63889943<br>BTW NL536084658B01</div>
          </div>
        </div>
        <div class="legal">
          <div>&copy; 2026 Safe Studios. All rights reserved.</div>
        </div>
      </footer>
    </div>
  </body>
</html>`;
}
