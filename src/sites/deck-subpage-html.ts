import { deckHeadHtml, deckBrandHtml, deckFooterHtml } from './deck-chrome-html.ts';

/**
 * Shared chrome for deck content pages (support, privacy, 404), per the
 * "Support" / "Privacy" Claude Design comps: brand nav with a back link,
 * a 760px content column of border-topped sections, the shared footer.
 */

export interface DeckSubpageOptions {
  title: string;
  description: string;
  kicker: string;
  heading: string;
  /** e.g. 'Last Updated: July 19, 2026' — privacy only */
  dateline?: string;
  /** Intro paragraph (HTML allowed) */
  lede: string;
  /** Inner HTML of each bordered section (h2/h3/p) */
  sections: string[];
  basePath?: string;
  origin?: string;
  /** Route path for the canonical link */
  path: string;
}

export default function deckSubpageHtml({
  title,
  description,
  kicker,
  heading,
  dateline,
  lede,
  sections,
  basePath = '',
  origin = 'https://deck.dj',
  path,
}: DeckSubpageOptions): string {
  const sectionHtml = sections
    .map(s => `<section class="doc-section">\n          ${s}\n        </section>`)
    .join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${deckHeadHtml({ title, description, origin, path })}
  </head>
  <body>
    <div class="subpage">
      <nav class="nav">
        ${deckBrandHtml(basePath)}
        <a class="back-link" href="${basePath}/">&larr; Back to Deck</a>
      </nav>
      <main>
        <p class="kicker">${kicker}</p>
        <h1>${heading}</h1>${dateline ? `
        <p class="dateline">${dateline}</p>` : ''}
        <p class="lede">${lede}</p>
        <div class="doc-sections">
        ${sectionHtml}
        </div>
      </main>
      ${deckFooterHtml(basePath)}
    </div>
  </body>
</html>`;
}
