import { Router } from 'express';
import type { Request, Response } from 'express';

const site = Router();

// safestudios.nl hosts nothing itself — /deck (and anything under it)
// forwards to the product site. Mounting preserves the sub-path, so
// /deck/privacy lands on deck.dj/privacy.
site.use('/deck', (req: Request, res: Response) => {
  res.redirect(301, `https://deck.dj${req.url === '/' ? '' : req.url}`);
});

site.get('/', (req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Safe Studios</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center;
             background: #0b0c0f; color: #e8eaed;
             font-family: -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
      main { text-align: center; }
      h1 { font-size: 1rem; font-weight: 600; letter-spacing: .35em;
           text-transform: uppercase; color: #8a94a0; }
      a { color: #ffb92e; text-decoration: none; font-size: 1.2rem; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <main>
      <h1>Safe Studios &middot; Amsterdam</h1>
      <p><a href="https://deck.dj">Deck &mdash; audio player for DJs &rarr;</a></p>
    </main>
  </body>
</html>`);
});

site.use((req: Request, res: Response) => {
  res.status(404).send('Not found');
});

export default site;
