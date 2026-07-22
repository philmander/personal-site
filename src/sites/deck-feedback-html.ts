import deckSubpageHtml from './deck-subpage-html.ts';
import { escapeHtml } from '../escape-html.ts';
import type { FeedbackInput, FeedbackErrors } from '../feedback-service.ts';

const EMAIL = '<a href="mailto:support@safestudios.nl">support@safestudios.nl</a>';

export interface DeckFeedbackOptions {
  basePath?: string;
  origin?: string;
  /** Render the post-submit confirmation instead of the form */
  sent?: boolean;
  /** Previously entered values, re-shown when validation or saving fails */
  values?: FeedbackInput;
  errors?: FeedbackErrors;
  /** Saving failed — show the mailto fallback */
  saveFailed?: boolean;
}

function fieldHtml(
  label: string,
  input: string,
  error: string | undefined,
): string {
  return `<div class="form-field">
              <label>${label}</label>
              ${input}${error ? `
              <p class="form-error">${escapeHtml(error)}</p>` : ''}
            </div>`;
}

function formHtml(
  basePath: string,
  values: FeedbackInput,
  errors: FeedbackErrors,
  saveFailed: boolean,
): string {
  return `${saveFailed ? `<p class="form-fail">Sorry &mdash; your message couldn't be saved just now. Please try again in a minute, or email ${EMAIL} instead.</p>
          ` : ''}<form class="feedback-form" method="post" action="${basePath}/feedback">
            <!-- Honeypot — humans never see it, bots fill it in -->
            <div class="form-nectar" aria-hidden="true">
              <label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>
            ${fieldHtml('Name',
              `<input type="text" name="name" value="${escapeHtml(values.name)}" autocomplete="name" required>`,
              errors.name)}
            ${fieldHtml('Email',
              `<input type="email" name="email" value="${escapeHtml(values.email)}" autocomplete="email" required>`,
              errors.email)}
            ${fieldHtml('Message',
              `<textarea name="message" rows="7" required>${escapeHtml(values.message)}</textarea>`,
              errors.message)}
            <button class="form-submit" type="submit">Send feedback</button>
          </form>`;
}

const SENT_HTML = `<h2>Thanks &mdash; got it.</h2>
          <p>Every message is read by the developer. If a reply is needed, you'll hear back at the address you gave.</p>`;

export default function deckFeedbackHtml({
  basePath = '',
  origin = 'https://deck.dj',
  sent = false,
  values = { name: '', email: '', message: '' },
  errors = {},
  saveFailed = false,
}: DeckFeedbackOptions = {}): string {
  return deckSubpageHtml({
    title: 'Feedback — Deck',
    description: 'Tell the developer of Deck what you think — ideas, requests and rough edges all welcome.',
    kicker: 'FEEDBACK',
    heading: sent ? 'Message sent' : 'Tell us what you think',
    lede: sent
      ? `Prefer email next time? ${EMAIL} works too.`
      : `Deck is built by one person, and feedback steers what gets built next. Ideas, requests and rough edges all welcome &mdash; or email ${EMAIL} if you'd rather.`,
    sections: [sent ? SENT_HTML : formHtml(basePath, values, errors, saveFailed)],
    basePath,
    origin,
    path: '/feedback',
  });
}
