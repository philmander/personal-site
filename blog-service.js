const { Octokit } = require("@octokit/rest");
const getBlogListHtml = require('./blog-list-html');
const marked = require('marked');
const highlight = require('highlight.js');

const octokit = new Octokit();
const owner = 'philmander';
const repo = 'versatile';

marked.setOptions({
  highlight: (code, lang) => {
    const language = highlight.getLanguage(lang) ? lang : 'plaintext';
    return highlight.highlight(lang, code).value;
  },
  langPrefix: 'hljs language-',
  gfm: true,
  tables: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
});

const cache = new Map();
const CACHE_CLEAR_INTERVAL = 1000 * 60 * 60 * 6; // 12 hours
setInterval(() => {
    cache.clear();
}, CACHE_CLEAR_INTERVAL);

async function getBlogList() {
  const path = 'blog.json';
  if(cache.get(path)) {
      return cache.get(path);
  }
  const blogJSON = await _getContentromGithub(path);
  const blogList = JSON.parse(blogJSON);
  const html = getBlogListHtml(blogList);
  //cache.set(path, blogRoll);
  return html;
}

async function getBlogPage(slug) {
  if(cache.get(slug)) {
    return cache.get(slug);
  }
  const html = _compileMarkdown(await _getContentromGithub(`blog/${slug}.md`))
  cache.set(slug, html);
  return html;
}

async function _getContentromGithub(_path) {
  const path = `content/${_path}`
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  return Buffer.from(res.data.content, 'base64').toString('utf8');
}

function _compileMarkdown(markdown) {
  return marked.parse(markdown).trim();
}

module.exports = {
  getBlogPage,
  getBlogList,
  _getContentromGithub,
  _compileMarkdown,
}