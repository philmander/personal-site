import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import serveImages from '../serve-images.ts';
import pageHtml from '../page-html.ts';
import contactHtml from '../contact-html.ts';
import { getBlogPage, getBlogList } from '../blog-service.ts';
import { logger } from '../logger.ts';

interface PageLocals {
  main?: string;
  aside?: string;
}

const site = Router();

site.use('/images', serveImages());

site.get('/blog/:pageSlug', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
  try {
      const pageSlug = Array.isArray(req.params.pageSlug) ? req.params.pageSlug[0] : req.params.pageSlug;
      res.locals.main = await getBlogPage(pageSlug);
      next();
  } catch(err: any) {
      logger.error({ err, slug: req.params.pageSlug }, 'Failed to load blog page');
      res.locals.main = '<p>Sorry, this blog post could not be loaded right now. Please try again later.</p>';
      next();
  }
});

// The Deck app's About screen links here; the page now lives on deck.dj
site.get('/deck/privacy', (req: Request, res: Response) => {
  res.redirect(301, 'https://deck.dj/privacy');
});

site.get('/', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
  try {
      res.locals.main = await getBlogList();
      res.locals.aside = contactHtml();
      next();
  } catch(err: any) {
      logger.error({ err }, 'Failed to load blog list');
      res.locals.main = '<p>Sorry, the blog could not be loaded right now. Please try again later.</p>';
      res.locals.aside = contactHtml();
      next();
  }
});

site.use(async (req: Request, res: Response<any, PageLocals>) => {
  const out = pageHtml({
    headerTitle: 'Phil Mander',
    main: res.locals.main || '',
    aside: res.locals.aside,
  });

  res.send(out);
});

export default site;
