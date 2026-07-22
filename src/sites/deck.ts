import { Router, urlencoded } from 'express';
import type { Request, Response } from 'express';
import deckLandingHtml from './deck-landing-html.ts';
import deckSupportHtml from './deck-support-html.ts';
import deckPrivacyHtml from './deck-privacy-html.ts';
import deckSubpageHtml from './deck-subpage-html.ts';
import deckFeedbackHtml from './deck-feedback-html.ts';
import { feedbackFromBody, validateFeedback, saveFeedback } from '../feedback-service.ts';
import { logger } from '../logger.ts';

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

  site.get('/feedback', (req: Request, res: Response) => {
    res.send(deckFeedbackHtml({ basePath, origin, sent: req.query.sent === '1' }));
  });

  site.post('/feedback', urlencoded({ extended: false }), async (req: Request, res: Response) => {
    // Honeypot tripped — claim success without saving
    if (req.body.website) {
      res.redirect(`${basePath}/feedback?sent=1`);
      return;
    }
    const values = feedbackFromBody(req.body);
    const errors = validateFeedback(values);
    if (Object.keys(errors).length > 0) {
      res.status(422).send(deckFeedbackHtml({ basePath, origin, values, errors }));
      return;
    }
    try {
      await saveFeedback(values);
      res.redirect(`${basePath}/feedback?sent=1`);
    } catch (err) {
      logger.error({ err }, 'Failed to save feedback');
      res.status(500).send(deckFeedbackHtml({ basePath, origin, values, saveFailed: true }));
    }
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
