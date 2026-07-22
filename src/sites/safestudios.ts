import { Router } from 'express';
import type { Request, Response } from 'express';
import { createDeckSite } from './deck.ts';
import { adminAuth } from '../admin-auth.ts';
import feedbackAdminHtml from './feedback-admin-html.ts';
import { getDb } from '../db.ts';
import { logger } from '../logger.ts';

const site = Router();

// Admin lives on safestudios.nl only — deliberately not mounted on the deck
// site, so the URL won't exist on deck.dj once that domain goes live
site.get('/admin/feedback', adminAuth, async (req: Request, res: Response) => {
  try {
    const rows = await getDb()
      .selectFrom('feedback')
      .selectAll()
      .orderBy('created_at', 'desc')
      .limit(500)
      .execute();
    res.send(feedbackAdminHtml(rows));
  } catch (err) {
    logger.error({ err }, 'Failed to load feedback admin');
    res.status(500).send('Database unavailable');
  }
});

// deck.dj's DNS registration is still in progress, so /deck serves the
// product site in full for now. Once deck.dj resolves, replace this mount
// with the original forward:
//   site.use('/deck', (req, res) =>
//     res.redirect(301, `https://deck.dj${req.url === '/' ? '' : req.url}`));
site.use('/deck', createDeckSite('/deck', 'https://safestudios.nl'));

// The Deck landing page is the only thing safestudios.nl hosts, so the
// root bounces straight to it. 302 while deck.dj's DNS is pending — the
// destination may become deck.dj later.
site.get('/', (req: Request, res: Response) => {
  res.redirect(302, '/deck');
});

site.use((req: Request, res: Response) => {
  res.status(404).send('Not found');
});

export default site;
