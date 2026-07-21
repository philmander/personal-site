import deckSubpageHtml from './deck-subpage-html.ts';

// Presentation per the "Privacy" Claude Design comp. The comp was pasted
// from a stale (Feb 2026, Android-only) copy of the policy; the wording
// here keeps the newer July 19, 2026 revision, which covers both Android
// and iOS.

const EMAIL = '<a href="mailto:support@safestudios.nl">support@safestudios.nl</a>';

export default function deckPrivacyHtml(opts: { basePath?: string; origin?: string } = {}): string {
  return deckSubpageHtml({
    title: 'Privacy — Deck',
    description: 'How Deck handles your data: nothing is collected, nothing is transmitted — your music and all analysis stay on your device.',
    kicker: 'PRIVACY POLICY',
    heading: 'Privacy Policy for Deck',
    dateline: 'Last Updated: July 19, 2026',
    lede: 'This Privacy Policy describes how Deck ("the App") handles your data, on both Android and iOS. Deck is a digital DJ deck application designed for local audio playback.',
    sections: [
      `<h2>1. Data collection and usage</h2>
          <h3>Local audio files</h3>
          <p>Deck requires access to your device's audio files (via the media/storage permissions on Android, or the file and folder access you grant on iOS) solely to allow you to browse and load your own music library for playback within the App. Your audio files are never uploaded to our servers or any third-party servers, and we do not transmit metadata (artist, title, etc.) from your files to any server.</p>
          <h3>Local caching</h3>
          <p>To provide a fast experience, the App generates and stores waveform data, BPM, beat grid, and track metadata (artist, title, duration, etc.) on your device's local storage. This data remains on your device and is not shared or transmitted.</p>`,
      `<h2>2. Data sharing</h2>
          <p>We do not share any personal information, audio data, or usage statistics with third parties. The App does not contain any third-party analytics, advertising SDKs, or tracking pixels.</p>`,
      `<h2>3. Permissions justification</h2>
          <p><strong>Background audio / media playback:</strong> used to keep audio playing when the App is in the background or the screen is off. On Android this runs as a foreground service with a persistent notification.<br><strong>Keeping the screen awake:</strong> used to prevent the screen from dimming during a performance.<br><strong>Storage / file access:</strong> necessary for you to select and play your music files.</p>`,
      `<h2>4. Children's privacy</h2>
          <p>Deck does not knowingly collect any personal information from children. Since the App does not collect any data at all, it is safe for users of all ages.</p>`,
      `<h2>5. Data retention and deletion</h2>
          <p>All cached data (waveforms, beat grids, metadata) is stored locally on your device. You can remove it at any time by clearing the App's data in your device settings or by uninstalling the App.</p>`,
      `<h2>6. Changes to this policy</h2>
          <p>We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.</p>`,
      `<h2>7. Contact us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at ${EMAIL}.</p>`,
    ],
    path: '/privacy',
    ...opts,
  });
}
