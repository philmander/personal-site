const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.philmander.deck';

/**
 * Decorative frequency-colored waveform strip, echoing the app's main
 * waveform: pure-color band layers nested tallest-first, never blended,
 * mirrored around the center line. Uses the Steel & Amber theme to match
 * the screenshot below it. Deterministic so the markup is stable across
 * renders.
 */
function waveformStrip(): string {
  const bars: string[] = [];
  const width = 960;
  const barWidth = 4;
  const gap = 3;
  const mid = 40;
  for (let i = 0, x = 0; x < width; i++, x += barWidth + gap) {
    const kick = i % 8 === 0 ? 1 : 0.62;
    const amp = (0.35 + 0.65 * Math.abs(Math.sin(i * 0.82) + 0.3 * Math.sin(i * 0.23))) / 1.3;
    const bass = Math.min(38, 38 * amp * kick);
    const midBand = bass * (0.25 + 0.55 * Math.abs(Math.sin(i * 0.61)));
    // Highs appear as sparse ice ticks, not a constant core
    const highGate = Math.sin(i * 2.9);
    const high = highGate > 0.6 ? bass * 0.3 * highGate : 0;
    for (const [h, color] of [
      [bass, '#7060d4'],
      [midBand, '#ff8f00'],
      [high, '#aee6ff'],
    ] as [number, string][]) {
      if (h < 0.5) continue;
      bars.push(`<rect x="${x}" y="${(mid - h).toFixed(1)}" width="${barWidth}" height="${(h * 2).toFixed(1)}" fill="${color}"/>`);
    }
  }
  return `<svg class="waveform-strip" viewBox="0 0 ${width} 80" preserveAspectRatio="none" aria-hidden="true">${bars.join('')}</svg>`;
}

export default function deckHomeHtml(): string {
  return `<section class="hero">
  <h1>The audio player for&nbsp;DJs.</h1>
  <p>Deck turns your phone into a professional CDJ-style deck &mdash; instant
  cues, beat-quantized loops, vinyl-real scratching and a frequency-colored
  waveform, driven by a native low-latency audio engine. No ads, no
  subscriptions, no data collected.</p>
  <div class="store-links">
    <a class="store-button" href="${PLAY_STORE_URL}">Get it on Google&nbsp;Play</a>
    <span class="store-button coming-soon">App&nbsp;Store &mdash; coming soon</span>
  </div>
</section>
${waveformStrip()}
<figure class="screenshot">
  <img src="/static/deck/hero.png" alt="Deck playing a track: frequency-colored waveform with beat grid, cue and loop controls" width="1600" height="736">
</figure>`;
}
