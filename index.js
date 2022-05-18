const express = require('express')
const Database = require("@replit/database");
const compression = require('compression')
const serveImages = require('./serve-images')
const pageHtml = require('./page-html')
const contactHtml = require('./contact-html')

const { log } = console

const { getBlogPage, getBlogList } = require('./blog-service')

;(async () => { 
  const db = new Database()
  
  const app = express()
  const port = 3000
  
  app.use('/static', compression())
  app.use('/static', express.static('static'))
  app.use('/images', serveImages());
  
  app.get('/blog/:pageSlug', async (req, res, next) => {
    try {
        const { pageSlug } = req.params
        res.locals.main = await getBlogPage(pageSlug)
        next();
    } catch(err) {
        err.status = 404;
        next(err);
    }
  })

  app.get('/', async (req, res, next) => {
    try {
        res.locals.main = await getBlogList()
        res.locals.aside = contactHtml();
        next();
    } catch(err) {
        err.status = 404;
        next(err);
    }
  })

  app.use(async (req, res) => {
    const dbHitsKey = `hits_${req.url}`
    const hits = await db.get(dbHitsKey) || 0
    
    const out = pageHtml({
      headerTitle: 'Phil Mander',
      hits,
      ...res.locals,
    })
    
    res.send(out)
    db.set(dbHitsKey, hits + 1)
  })
  
  app.listen(port, () => {
    log(`Express server is running on port: ${port}`)
  })
})()
