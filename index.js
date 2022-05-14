const express = require('express')
const compression = require('compression')
const pageHtml = require('./page-html')
const contactHtml = require('./contact-html')

const { getBlogPage, getBlogList } = require('./blog-service')

;(async () => { 
  const app = express()
  const port = 3000
  
  app.use(compression())
  app.use('/static', express.static('static'))
  
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
        const { pageSlug } = req.params;
        res.locals.main = await getBlogList()
        res.locals.aside = contactHtml();
        next();
    } catch(err) {
        err.status = 404;
        next(err);
    }
  })

  app.use(async (req, res) => {
    const out = pageHtml({
      headerTitle: 'Phil Mander',
      ...res.locals,
    })
    res.send(out)
  })
  
  app.listen(port, () => {
    console.log(`Site is running on ${port}`)
  })
})()
