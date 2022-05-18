const fs = require('fs').promises;
const { join } = require('path');
const serveStatic = require('serve-static');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();
const owner = 'philmander';
const repo = 'versatile';

const localImagesDir = join(process.cwd(), '/images')
let imageServer;
let availableGhImages = [];
let ready = false;

; (async () => {
  try {
    // images are pulled from github and cached here
    await fs.mkdir(localImagesDir);
  } catch (err) {
    // creating the directory will always subsequently fail
    if (err.code !== 'EEXIST') {
      console.error(err)
      throw err;
    }
  }

  // pre-fetch the blog images available in github, so gh api can't be spammed with 404s
  const ghRes = await octokit.rest.repos.getContent({ owner, repo, path: 'content/images' });
  availableGhImages = ghRes.data.map(file => `/${file.name}`);

  imageServer = serveStatic(localImagesDir, {
    index: false
  });
  ready = true;
})()

module.exports = function() {
  return async (req, res, next) => {
    if (!ready) {
      return next(makeHttpError('Not ready', 503, req));
    }

    const imagePath = req.url
    const fullImagePath = join(localImagesDir, imagePath);
    // try to serve the local image
    imageServer(req, res, async () => {
      // image not found locally so get it from github
      try {
        if (!availableGhImages.includes(imagePath)) {
          throw makeHttpError('Not found', 404, req);
        }
        const ghPath = join('content/images', imagePath);
        const ghRes = await octokit.rest.repos.getContent({ owner, repo, path: ghPath });
        const buff = Buffer.from(ghRes.data.content, 'base64');
        await fs.writeFile(fullImagePath, buff, 'base64')
        imageServer(req, res, err => {
          err.status = 404;
          err.url = req.originalUrl;
          next(err);
        });
      } catch (err) {
        next(err);
      }
    })
  }
}

function makeHttpError(message, status, req) {
  const err = new Error(message);
  err.status = status;
  err.url = req.originalUrl;
  return err;
}