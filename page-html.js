module.exports = ({
  headerTitle,
  css,
  main,
  aside = '',
  hits,
}) => 
`<DOCTYPE html>
<html>
  <head>
    <title>Phil Mander</title>
    <link href="/static/styles.css" rel="stylesheet">
  </head>
  <body>
    <div id="app">
      <div>
        <header class="page-header">
          <p><a href="/">${headerTitle}</a></p>
        </header>
        
        <div class="row wrap home">
          <main class="page-main col-xs-12 col-sm-12 col-md-8">
            ${main}
          </main>
          <aside class="col-xs-12 col-sm-12 col-md-4">
            ${aside}
          </aside>
        </div>
        <footer class="page-footer">
          <p style="text-align: right"><small>${hits}</small></p>
        </footer>
      </div>
    </div>
  </body>
</html>`