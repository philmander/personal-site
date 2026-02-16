import { Octokit } from "@octokit/rest";
import getBlogListHtml from './blog-list-html.ts';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { logger } from './logger.ts';
const octokit = new Octokit();
const owner = 'philmander';
const repo = 'versatile';

// Configure marked with renderer for syntax highlighting
marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const language = lang || 'plaintext';
      try {
        const highlighted = hljs.highlight(text, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
      } catch (err) {
        const highlighted = hljs.highlight(text, { language: 'plaintext' }).value;
        return `<pre><code class="hljs language-plaintext">${highlighted}</code></pre>`;
      }
    }
  }
});

interface BlogEntry {
  title: string;
  time: string;
  path: string;
  description?: string;
}

const cache = new Map<string, string>();
const CACHE_CLEAR_INTERVAL = 1000 * 60 * 60 * 6; // 6 hours
setInterval(() => {
    cache.clear();
}, CACHE_CLEAR_INTERVAL);

export async function getBlogList(): Promise<string> {
  const path = 'blog.json';
  if(cache.get(path)) {
      return cache.get(path)!;
  }
  logger.info('Getting list of blog articles from Github');
  const blogJSON = await _getContentFromGithub(path);
  const allEntries: BlogEntry[] = JSON.parse(blogJSON);
  
  // Filter to only show entries from the last 5 years
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  
  const blogList = allEntries.filter(entry => {
    const entryDate = new Date(entry.time);
    return entryDate >= fiveYearsAgo;
  });
  
  logger.info({ 
    total: allEntries.length, 
    filtered: blogList.length,
    cutoffDate: fiveYearsAgo.toISOString()
  }, 'Blog articles filtered by date');
  
  const html = getBlogListHtml(blogList);
  cache.set(path, html);
  return html;
}

export async function getBlogPage(slug: string): Promise<string> {
  if(cache.get(slug)) {
    return cache.get(slug)!;
  }
  const html = _compileMarkdown(await _getContentFromGithub(`blog/${slug}.md`));
  cache.set(slug, html);
  return html;
}

export async function _getContentFromGithub(_path: string): Promise<string> {
  const path = `content/${_path}`;
  logger.info({ path }, 'Getting content from Github');
  const res = await octokit.rest.repos.getContent({ owner, repo, path });
  logger.info({ path }, 'Content retrieved from Github');
  
  if (Array.isArray(res.data) || res.data.type !== 'file') {
    throw new Error(`Expected file but got ${Array.isArray(res.data) ? 'directory' : res.data.type}`);
  }
  
  return Buffer.from(res.data.content, 'base64').toString('utf8');
}

export function _compileMarkdown(markdown: string): string {
  return (marked.parse(markdown, { async: false }) as string).trim();
}
