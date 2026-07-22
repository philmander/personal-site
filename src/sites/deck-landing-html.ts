import { PLAY_URL, deckHeadHtml, deckBrandHtml, deckFooterHtml } from './deck-chrome-html.ts';

/**
 * The deck.dj landing page, implementing the "Deck Landing" Claude Design
 * comp (claude.ai/design project "DJ App Deck landing page"). The App
 * Store badge opens the comp's "Coming soon" dialog until the iOS app
 * ships — swap it for a real store link then.
 */

interface DeckLandingOptions {
  /** Link prefix when served from a sub-path (e.g. '/deck' on safestudios.nl). */
  basePath?: string;
  /** Origin serving this page; social-preview image URLs must be absolute. */
  origin?: string;
}

const DESCRIPTION = 'Deck is a fully featured audio player built for DJs. '
  + 'Plug in, drop it on a spare channel, and play, cue, loop and beat-match '
  + 'digital tracks alongside your turntables.';

const SHOTS = [
  { file: 'zoom-out', label: 'OVERVIEW', title: 'See the whole track at a glance.' },
  { file: 'zoom-in', label: 'WAVEFORM', title: 'Zoom in to the transient you need.' },
  { file: 'loop', label: 'LOOP', title: 'Auto loops locked to the beat grid.' },
  { file: 'hot-cues', label: 'HOT CUES', title: 'CDJ-style hot cues, ready to drop.' },
  { file: 'library', label: 'LIBRARY', title: 'Your music, folders and playlists.' },
];

const FEATURES = [
  { tag: 'BEAT-MATCH', title: 'Nudge + tempo pad', body: 'Track nudge and tempo adjust on a dedicated beat-match pad, built for riding the pitch by ear.' },
  { tag: 'WAVEFORM', title: 'Detailed waveforms', body: 'Detailed and track-summary waveform views with multiple zoom levels.' },
  { tag: 'BPM', title: 'Auto beat grid', body: 'Auto BPM detection and beat grid, with full manual override controls.' },
  { tag: 'CUE', title: 'CDJ-style cues', body: 'CDJ-style cue point controls and hot cues with super low latency playback.' },
  { tag: 'QUANTIZE', title: 'Quantized everything', body: 'Quantization support for cue points and looping keeps drops locked to the grid.' },
  { tag: 'FX', title: 'Effects rack', body: 'High/low pass filters, echo, flange, reverb and more.' },
  { tag: 'LIBRARY', title: 'Media library', body: 'Organize your tracks with a full media library and playlists.' },
  { tag: 'LOOP', title: 'Auto looping', body: 'Auto looping controls with adjustable loop lengths.' },
  { tag: 'VINYL', title: 'Reverse + motor kill', body: 'Reverse play and motor kill for classic turntablist moves.' },
];

const APPLE_LOGO_SVG = '<svg class="badge-apple" viewBox="0 0 384 512" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

const PLAY_LOGO_SVG = '<svg class="badge-play" viewBox="0 0 512 512" aria-hidden="true">'
  + '<path fill="#00D7FE" d="M48 59.5v393c0 6.8 3.6 12.6 9.2 15.7L286.9 256 57.2 43.8C51.6 46.9 48 52.7 48 59.5z"/>'
  + '<path fill="#FFCE00" d="M345.5 202.3 92.8 36.9l-.4-.2c-4.4-2.6-9.3-3.4-13.9-2.6L286.9 256l58.6-53.7z"/>'
  + '<path fill="#FF3A44" d="M78.5 477.9c4.6.8 9.5 0 13.9-2.6l.4-.2 252.7-165.4L286.9 256 78.5 477.9z"/>'
  + '<path fill="#00F076" d="m425.8 245.3-71.5-46.8L288 256l66.3 57.5 71.5-46.8c13.6-8.9 13.6-27.5 0-36.4z"/>'
  + '</svg>';

function storeBadges(): string {
  return `<div class="store-badges">
  <button class="store-badge js-coming-soon" type="button">
    ${APPLE_LOGO_SVG}
    <span class="badge-text">
      <span class="badge-small">Download on the</span>
      <span class="badge-big">App&nbsp;Store</span>
    </span>
  </button>
  <a class="store-badge" href="${PLAY_URL}">
    ${PLAY_LOGO_SVG}
    <span class="badge-text">
      <span class="badge-small">Get it on</span>
      <span class="badge-big">Google&nbsp;Play</span>
    </span>
  </a>
</div>`;
}

export default function deckLandingHtml({
  basePath = '',
  origin = 'https://deck.dj',
}: DeckLandingOptions = {}): string {
  const shotData = SHOTS.map(s => ({
    src: `/static/deck/shots/${s.file}.png`,
    label: s.label,
    title: s.title,
  }));

  const featureTiles = FEATURES.map(f => `<div class="feature">
      <p class="feature-tag">${f.tag}</p>
      <h3>${f.title}</h3>
      <p class="feature-body">${f.body}</p>
    </div>`).join('\n    ');

  const thumbs = shotData.map((s, i) => `<button class="shot-thumb${i === 0 ? ' selected' : ''}" type="button">
      <img src="${s.src}" alt="${s.label}" loading="lazy" decoding="async">
      <span>${s.label}</span>
    </button>`).join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${deckHeadHtml({ title: 'Deck — Pro Audio Player for DJs', description: DESCRIPTION, origin, path: '/' })}
  </head>
  <body>
    <nav class="nav">
      ${deckBrandHtml(basePath)}
      <div class="nav-links">
        <a href="#setup">SETUP</a>
        <a href="#features">FEATURES</a>
        <a class="get-deck" href="${PLAY_URL}">GET DECK</a>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-bg">
        <img src="/static/deck/hero.jpg" alt="Deck running on a phone plugged into a DJ mixer" fetchpriority="high">
        <div class="scrim-x"></div>
        <div class="scrim-y"></div>
      </div>
      <div class="hero-banner">
        <img src="/static/deck/hero.jpg" alt="Deck running on a phone plugged into a DJ mixer" fetchpriority="high">
        <div class="scrim"></div>
      </div>
      <div class="hero-content">
        <div class="hero-spacer"></div>
        <div class="hero-copy">
          <h1>No CDJ, no problem.</h1>
          <p class="hero-lede">${DESCRIPTION}</p>
          ${storeBadges()}
          <p class="fine-print">No ads &middot; No in-app purchases &middot; No data collected</p>
        </div>
      </div>
    </header>

    <section id="setup" class="section">
      <p class="kicker">01 — SETUP</p>
      <h2>One cable between your phone and the mix.</h2>
      <div class="setup-steps">
        <div class="step">
          <div class="step-head"><span class="step-num">1</span><h3>Connect</h3></div>
          <p>Run a USB-C to RCA cable from your device into one of your mixer's line input channels.</p>
        </div>
        <div class="step">
          <div class="step-head"><span class="step-num">2</span><h3>Load a track</h3></div>
          <p>Browse your media library and playlists. Auto BPM detection builds the beat grid for you.</p>
        </div>
        <div class="step">
          <div class="step-head"><span class="step-num">3</span><h3>Mix</h3></div>
          <p>Cue, loop, nudge and tempo-adjust with the beat-match pad &mdash; right alongside your other decks.</p>
        </div>
      </div>
      <div class="setup-uses">
        <div class="use">
          <h4>Extra digital channel</h4>
          <p>Add a digital source to your vinyl setup &mdash; no X/CDJ required.</p>
        </div>
        <div class="use">
          <h4>Portable rig</h4>
          <p>Two devices + a lightweight mixer = a professional DJ setup that fits in a bag.</p>
        </div>
        <div class="use">
          <h4>Emergency backup</h4>
          <p>A CDJ dies mid-set? Plug in your phone and keep the floor moving.</p>
        </div>
      </div>
    </section>

    <figure class="live-photo">
      <img src="/static/deck/rig.jpg" alt="Two phones running Deck connected to a compact mixer" loading="lazy" decoding="async">
      <div class="scrim"></div>
      <figcaption>Deck is pictured running on OnePlus 13 (left), iPhone 14 (right) through an Omnitronic Gnome 202 mini mixer</figcaption>
    </figure>

    <section id="features" class="section">
      <p class="kicker">02 — FEATURES</p>
      <h2>Professional controls. Super low latency.</h2>
      <div class="features-grid">
        ${featureTiles}
      </div>
    </section>

    <section id="screens" class="screens-band">
      <div class="section">
        <p class="kicker">03 — IN THE APP</p>
        <h2 id="shot-title">${shotData[0].title}</h2>
        <div class="shot-stage">
          <img id="shot-main" src="${shotData[0].src}" alt="${shotData[0].title}">
          <button class="shot-arrow prev" type="button" aria-label="Previous screenshot">&#8249;</button>
          <button class="shot-arrow next" type="button" aria-label="Next screenshot">&#8250;</button>
        </div>
        <div class="shot-thumbs">
          ${thumbs}
        </div>
      </div>
    </section>

    <section class="cta">
      <img class="cta-photo" src="/static/deck/cta.jpg" alt="Deck beside glowing mixer channel meters" loading="lazy" decoding="async">
      <div class="cta-scrim"></div>
      <div class="cta-inner">
        <h2>Turn a spare device into your next deck.</h2>
        ${storeBadges()}
        <p class="cta-tagline">&#9679; NO ADS &middot; NO IN-APP PURCHASES &middot; NO TRACKING</p>
      </div>
    </section>

    <div class="dialog-overlay" id="coming-soon" hidden>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title">
        <img src="/static/deck/icon.png" alt="" width="56" height="56">
        <h3 id="coming-soon-title">Coming soon&hellip;</h3>
        <p>Deck for iOS is on its way to the App Store. In the meantime, it's available now on Google Play.</p>
        <button class="dialog-ok" type="button">OK</button>
      </div>
    </div>

    ${deckFooterHtml(basePath)}

    <script>
    (function () {
      var shots = ${JSON.stringify(shotData)};
      var main = document.getElementById('shot-main');
      var title = document.getElementById('shot-title');
      var thumbs = Array.prototype.slice.call(document.querySelectorAll('.shot-thumb'));
      var current = 0;
      function show(n) {
        current = (n + shots.length) % shots.length;
        var s = shots[current];
        main.src = s.src;
        main.alt = s.title;
        title.textContent = s.title;
        thumbs.forEach(function (t, j) { t.classList.toggle('selected', j === current); });
      }
      document.querySelector('.shot-arrow.prev').addEventListener('click', function () { show(current - 1); });
      document.querySelector('.shot-arrow.next').addEventListener('click', function () { show(current + 1); });
      thumbs.forEach(function (t, j) { t.addEventListener('click', function () { show(j); }); });

      var overlay = document.getElementById('coming-soon');
      function closeDialog() { overlay.hidden = true; }
      Array.prototype.forEach.call(document.querySelectorAll('.js-coming-soon'), function (b) {
        b.addEventListener('click', function () { overlay.hidden = false; });
      });
      overlay.addEventListener('click', closeDialog);
      overlay.querySelector('.dialog').addEventListener('click', function (e) { e.stopPropagation(); });
      overlay.querySelector('.dialog-ok').addEventListener('click', closeDialog);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDialog(); });
    })();
    </script>
  </body>
</html>`;
}
