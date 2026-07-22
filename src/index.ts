import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import siteForHost from './sites/site-for-host.ts';
import philmanderSite from './sites/philmander.ts';
import safestudiosSite from './sites/safestudios.ts';
import deckSite from './sites/deck.ts';
import { migrateToLatest } from './migrate.ts';
import { logger } from './logger.ts';

(async () => {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  // The database only backs the feedback form, so a failed migration run
  // logs loudly but never stops the rest of the site from serving
  if (process.env.DATABASE_URL) {
    await migrateToLatest();
  } else {
    logger.warn('DATABASE_URL not set — skipping migrations');
  }

  // TLS terminates in the proxy in front of this container; trust its
  // forwarded headers so req.hostname sees the requested domain
  app.set('trust proxy', true);

  app.use('/static', compression());
  app.use('/static', express.static('static'));

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('ok');
  });

  // One server, three domains — everything below routes on the Host header
  const sites = {
    philmander: philmanderSite,
    safestudios: safestudiosSite,
    deck: deckSite,
  };

  app.use((req: Request, res: Response, next: NextFunction) => {
    sites[siteForHost(req.hostname)](req, res, next);
  });

  app.listen(port, () => {
    logger.info({ port }, 'Express server is running');
  });
})();
