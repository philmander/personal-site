const dateFormatOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

module.exports = data => 
`<dl>
${data.map(entry => 
`<dt><a href="${entry.path}">${entry.title}</a></dt>
  <dd>
      <p class="date">${ new Intl.DateTimeFormat('en-NL', dateFormatOpts).format(new Date(entry.time)) }</p>
    ${entry.description ? `  <p>${entry.description}</p>` : ''}
  </dd>`
).join('')}
</dl>
`