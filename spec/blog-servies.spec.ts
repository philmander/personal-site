import { test } from 'node:test';
import assert from 'node:assert';
import {
    getBlogPage,
  _getContentFromGithub,
  _compileMarkdown,
} from '../src/blog-service.ts';

test('getBlogPage', async () => {
  const content = await getBlogPage('foo');
  assert.strictEqual(content, '<p>Foo page: foo</p>');
});

// test.skip('_getContentFromGithub', async () => {
//   const content = await _getContentFromGithub('blog/deploying-lerna-web-apps-with-docker');
//   assert.strictEqual(content, '<h1 id="foo">foo</h1>');
// });
