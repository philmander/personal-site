const fs = require('fs').promises;
const { join } = require('path');
const serveStatic = require('serve-static');
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();
const owner = 'philmander';
const repo = 'versatile';

const localImagesDir = join(process.cwd(), '/images')
let imageServer;

;(async () => { 
  try {
    // images are pulled from github and cached here
    await fs.mkdir(localImagesDir);
  } catch (err) {
    if(err.code !== 'EEXIST') {
      console.error(err);
    }
  }
  
  imageServer = serveStatic(localImagesDir, {
    index: false
  });
})()
  
module.exports = function() {
  return async (req, res, next) => {
    const imagePath = req.url
    const fullImagePath = join(localImagesDir, imagePath);
    // try to serve the local image
    imageServer(req, res, async () => {
      // image not found locally so get it from github
      try {
        const ghPath = join('content/images', imagePath);
        const ghRes = await octokit.rest.repos.getContent({ owner, repo, path: ghPath });
        const buff = Buffer.from(ghRes.data.content, 'base64');
        await fs.writeFile(fullImagePath, buff, 'base64')
        imageServer(req, res, err => {
          req.status = 404;
          req.url = req.originalUrl;
          next(err);
        });
      } catch (err) {
        next(err);
      }
    })
  }
}