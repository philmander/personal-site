interface BlogEntry {
  title: string;
  time: string;
  path: string;
  description?: string;
}

const dateFormatOpts: Intl.DateTimeFormatOptions = { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
};

export default function getBlogListHtml(data: BlogEntry[]): string {
  return `<dl>
${data.map(entry => 
`<dt><a href="${entry.path}">${entry.title}</a></dt>
  <dd>
      <p class="date">${ new Intl.DateTimeFormat('en-NL', dateFormatOpts).format(new Date(entry.time)) }</p>
    ${entry.description ? `  <p>${entry.description}</p>` : ''}
  </dd>`
).join('')}
</dl>
`;
}
