import { Router } from 'express';
import type { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import deckPageHtml from './deck-page-html.ts';
import deckHomeHtml from './deck-home-html.ts';
import { _compileMarkdown } from '../blog-service.ts';
import { logger } from '../logger.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, '../content/deck');

const site = Router();

site.get('/', (req: Request, res: Response) => {
  res.send(deckPageHtml({ main: deckHomeHtml() }));
});

async function markdownPage(res: Response, file: string, title: string) {
  try {
    const markdown = await fs.readFile(join(contentDir, file), 'utf-8');
    res.send(deckPageHtml({
      title: `${title} — Deck`,
      main: `<article class="prose">${_compileMarkdown(markdown)}</article>`,
    }));
  } catch (err: any) {
    logger.error({ err, file }, 'Failed to load deck page');
    res.status(500).send(deckPageHtml({
      title: `${title} — Deck`,
      main: '<article class="prose"><p>Sorry, this page could not be loaded right now. Please try again later.</p></article>',
    }));
  }
}

site.get('/support', (req: Request, res: Response) => markdownPage(res, 'support.md', 'Support'));
site.get('/privacy', (req: Request, res: Response) => markdownPage(res, 'privacy.md', 'Privacy Policy'));

site.use((req: Request, res: Response) => {
  res.status(404).send(deckPageHtml({
    title: 'Not found — Deck',
    main: '<article class="prose"><h2>Page not found</h2><p><a href="/">Back to deck.dj</a></p></article>',
  }));
});

export default site;
