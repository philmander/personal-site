import { timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Constant-time check of a Basic Auth header against ADMIN_PASSWORD.
 * The username half of the credentials is ignored — there's one admin.
 */
export function basicAuthPasses(header: string | undefined, expected: string | undefined): boolean {
  if (!expected || !header?.startsWith('Basic ')) {
    return false;
  }
  const given = Buffer.from(header.slice('Basic '.length), 'base64')
    .toString()
    .split(':')
    .slice(1)
    .join(':');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  if (!basicAuthPasses(req.headers.authorization, process.env.ADMIN_PASSWORD)) {
    res
      .set('WWW-Authenticate', 'Basic realm="Deck admin", charset="UTF-8"')
      .status(401)
      .send('Authentication required');
    return;
  }
  next();
}
