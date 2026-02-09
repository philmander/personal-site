import { promises as fs } from 'fs';
import { join } from 'path';
import serveStatic from 'serve-static';
import { Octokit } from "@octokit/rest";
import type { Request, Response, NextFunction } from 'express';
import { logger } from './logger.ts';

const octokit = new Octokit();
const owner = 'philmander';
const repo = 'versatile';

const localImagesDir = join(process.cwd(), '/images');
let imageServer: ReturnType<typeof serveStatic>;
let availableGhImages: string[] = [];
let ready = false;

(async () => {
  try {
    // images are pulled from github and cached here
    await fs.mkdir(localImagesDir);
  } catch (err: any) {
    // creating the directory will always subsequently fail
    if (err.code !== 'EEXIST') {
      logger.error({ err }, 'Error creating images directory');
      throw err;
    }
  }

  // pre-fetch the blog images available in github, so gh api can't be spammed with 404s
  logger.info('Prefetching image list from Github');
  const ghRes = await octokit.rest.repos.getContent({ owner, repo, path: 'content/images' });
  
  if (Array.isArray(ghRes.data)) {
    availableGhImages = ghRes.data.map(file => `/${file.name}`);
  }
  logger.info({ count: availableGhImages.length }, 'Image paths retrieved from Github');

  logger.info({ directory: localImagesDir }, 'Serving images from local directory');
  imageServer = serveStatic(localImagesDir, {
    index: false
  });
  ready = true;
})();

export default function serveImages() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!ready) {
      logger.warn('Image requested but service is not ready');
      return next(makeHttpError('Not ready', 503, req));
    }

    const imagePath = req.url;
    const fullImagePath = join(localImagesDir, imagePath);
    // try to serve the local image
    imageServer(req, res, async () => {
      // image not found locally so get it from github
      try {
        if (!availableGhImages.includes(imagePath)) {
          logger.warn({ imagePath }, 'Requested image does not exist in available Github images list');
          throw makeHttpError('Not found', 404, req);
        }
        logger.info({ imagePath }, 'Requesting image from Github');
        const ghPath = join('content/images', imagePath);
        const ghRes = await octokit.rest.repos.getContent({ owner, repo, path: ghPath });
        logger.info({ imagePath }, 'Image retrieved from Github');
        
        if (Array.isArray(ghRes.data) || ghRes.data.type !== 'file') {
          throw makeHttpError('Not found', 404, req);
        }
        
        const buff = Buffer.from(ghRes.data.content, 'base64');
        await fs.writeFile(fullImagePath, buff);
        imageServer(req, res, (err: any) => {
          if (err) {
            err.status = 404;
            err.url = req.originalUrl;
            next(err);
          }
        });
      } catch (err: any) {
        next(err);
      }
    });
  };
}

function makeHttpError(message: string, status: number, req: Request): Error {
  const err = new Error(message) as Error & { status: number; url: string };
  err.status = status;
  err.url = req.originalUrl;
  return err;
}
