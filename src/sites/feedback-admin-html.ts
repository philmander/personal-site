import { escapeHtml } from '../escape-html.ts';
import type { Selectable } from 'kysely';
import type { FeedbackTable } from '../db.ts';

export type FeedbackRow = Selectable<FeedbackTable>;

function formatDate(d: Date): string {
  return d.toLocaleString('en-GB', {
    timeZone: 'Europe/Amsterdam',
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function rowHtml(row: FeedbackRow): string {
  return `<article class="entry">
        <header>
          <strong>${escapeHtml(row.name)}</strong>
          <a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a>
          <time>${formatDate(row.created_at)}</time>
        </header>
        <p>${escapeHtml(row.message)}</p>
      </article>`;
}

/**
 * Private admin listing of feedback submissions — served behind Basic Auth
 * on safestudios.nl only, so no shared deck chrome and no robots.
 */
export default function feedbackAdminHtml(rows: FeedbackRow[]): string {
  const entries = rows.length > 0
    ? rows.map(rowHtml).join('\n      ')
    : '<p class="empty">No feedback yet.</p>';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>Feedback admin — Deck</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        background: #0a0a0c;
        color: #eceae6;
        font-family: "IBM Plex Sans", -apple-system, "Segoe UI", Roboto, sans-serif;
        max-width: 760px;
        margin: 0 auto;
        padding: 40px 20px 80px;
      }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .count { color: #a4a19b; font-size: 14px; margin-bottom: 32px; }
      .entry { border-top: 1px solid #232327; padding: 20px 0; }
      .entry header {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 16px;
        align-items: baseline;
        margin-bottom: 10px;
      }
      .entry a { color: #faff63; text-decoration: none; }
      .entry time { color: #a4a19b; font-size: 13px; margin-left: auto; }
      .entry p { color: #c9c6bf; line-height: 1.6; white-space: pre-wrap; }
      .empty { color: #a4a19b; }
    </style>
  </head>
  <body>
    <h1>Deck feedback</h1>
    <p class="count">${rows.length} ${rows.length === 1 ? 'message' : 'messages'}</p>
    ${entries}
  </body>
</html>`;
}
