import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import serveImages from './serve-images.ts';
import pageHtml from './page-html.ts';
import contactHtml from './contact-html.ts';
import { getBlogPage, getBlogList } from './blog-service.ts';
import { logger } from './logger.ts';

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
  
  app.get('/blog/:pageSlug', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
    try {
        const pageSlug = Array.isArray(req.params.pageSlug) ? req.params.pageSlug[0] : req.params.pageSlug;
        res.locals.main = await getBlogPage(pageSlug);
        next();
    } catch(err: any) {
        err.status = 404;
        next(err);
    }
  });

  app.get('/', async (req: Request, res: Response<any, PageLocals>, next: NextFunction) => {
    try {
        res.locals.main = await getBlogList();
        res.locals.aside = contactHtml();
        next();
    } catch(err: any) {
        err.status = 404;
        next(err);
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
