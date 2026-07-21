import { Router } from 'express';
import type { Request, Response } from 'express';
import deckLandingHtml from './deck-landing-html.ts';
import deckSupportHtml from './deck-support-html.ts';
import deckPrivacyHtml from './deck-privacy-html.ts';
import deckSubpageHtml from './deck-subpage-html.ts';

/**
 * The deck.dj product site. basePath/origin let the same site be served
 * from a sub-path on another domain (safestudios.nl/deck) while deck.dj's
 * DNS registration is still in progress.
 */
export function createDeckSite(basePath = '', origin = 'https://deck.dj'): Router {
  const site = Router();

  site.get('/', (req: Request, res: Response) => {
    res.send(deckLandingHtml({ basePath, origin }));
  });

  site.get('/support', (req: Request, res: Response) => {
    res.send(deckSupportHtml({ basePath, origin }));
  });

  site.get('/privacy', (req: Request, res: Response) => {
    res.send(deckPrivacyHtml({ basePath, origin }));
  });

  site.use((req: Request, res: Response) => {
    res.status(404).send(deckSubpageHtml({
      title: 'Not found — Deck',
      description: 'Page not found.',
      kicker: '404',
      heading: 'Page not found',
      lede: `This page doesn't exist. <a href="${basePath}/">Back to Deck &rarr;</a>`,
      sections: [],
      basePath,
      origin,
      path: '/',
    }));
  });

  return site;
}

export default createDeckSite();
