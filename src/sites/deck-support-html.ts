import deckSubpageHtml from './deck-subpage-html.ts';

// Content per the "Support" Claude Design comp.

const EMAIL = '<a href="mailto:support@safestudios.nl">support@safestudios.nl</a>';

export default function deckSupportHtml(opts: { basePath?: string; origin?: string } = {}): string {
  return deckSubpageHtml({
    title: 'Support — Deck',
    description: 'Questions, bug reports and feature requests for Deck — email support@safestudios.nl and you\'ll hear back from the developer.',
    kicker: 'SUPPORT',
    heading: 'How can we help?',
    lede: `Questions, bug reports and feature requests are all welcome &mdash; email ${EMAIL} and you'll hear back from the developer.`,
    sections: [
      `<h2>How do I connect my device to a mixer?</h2>
          <p>Use a USB-C to RCA cable from your Android device into one of your mixer's line input channels. Deck then behaves like any other line source &mdash; play, cue, loop and beat-match alongside your turntables.</p>`,
      `<h2>The beat grid is slightly off &mdash; can I fix it?</h2>
          <p>Yes. BPM detection is automatic, but you can override it: tap the tempo manually and shift the beat grid using the beatgrid controls until the markers sit on the beats.</p>`,
      `<h2>Does Deck work offline?</h2>
          <p>Completely. Deck plays files from your device's local library and needs no network connection, account or sign-in.</p>`,
      `<h2>Found a bug?</h2>
          <p>Email ${EMAIL} with your device model, OS version and what happened. Screen recordings help a lot.</p>`,
    ],
    path: '/support',
    ...opts,
  });
}
