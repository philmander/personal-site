import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import serveImages from './serve-images.ts';
import pageHtml from './page-html.ts';
import contactHtml from './contact-html.ts';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getBlogPage, getBlogList, _compileMarkdown } from './blog-service.ts';
import { logger } from './logger.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface PageLocals {
  main?: string;
  aside?: string;
}

(async () => { 
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  
  app.use('/static', compression());
  app.use('/static', express.static('static'));
  app.use('/images', serveImages());

  app.get('/health', (req: Request, res: Response) => {
    res.status(200).send('ok');
  });

  app.get('/blog/:pageSlug', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
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

  app.get('/deck/privacy', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
    try {
        const markdown = await fs.readFile(join(__dirname, 'content/privacy.md'), 'utf-8');
        res.locals.main = _compileMarkdown(markdown);
        next();
    } catch(err: any) {
        logger.error({ err }, 'Failed to load privacy page');
        res.locals.main = '<p>Sorry, this page could not be loaded right now. Please try again later.</p>';
        next();
    }
  });

  app.get('/', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
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

  app.use(async (req: Request, res: Response<any, PageLocals>) => {
    const out = pageHtml({
      headerTitle: 'Phil Mander',
      main: res.locals.main || '',
      aside: res.locals.aside,
    });

    res.send(out);
  });
  
  app.listen(port, () => {
    logger.info({ port }, 'Express server is running');
  });
})();
