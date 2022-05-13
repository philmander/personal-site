const tap = require('tap')
const {
    getBlogPage,
  _getContentromGithub,
  _compileMarkdown,
} = require('../blog-service')

tap.test('getBlogPage', async t => {
  const content = await getBlogPage('foo')
  t.equal(content, '<p>Foo page: foo</p>')
})

// tap.skip('_getContentromGithub', async t => {
//   const content = await _getContentromGithub('blog/deploying-lerna-web-apps-with-docker')
//   t.equal(content, '<h1 id="foo">foo</h1>')
// })