const tap = require('tap')

const getBlogListHtml = require('../blog-list-html');

const data =
[
  {
    "title" : "My birthday",
    "time" : "2023-03-16T15:10:16.389Z",
    "path": "/my-birthday"
  },
  {
    "title" : "Cats' birthday",
    "time" : "2022-05-19T15:10:16.389Z",
    "path": "/cats-birthday",
    "description" : "My Cats are one!"
  },
]

const expected = 
`
<dl>
  <dt><a href="/my-birthday">My birthday</a></dt>
  <dd>
      <p class="date">Thursday, 16 March 2023</p>
  </dd>
  <dt><a href="/cats-birthday">Cats' birthday</a></dt>
  <dd>
      <p class="date">Thursday, 19 May 2022</p>
      <p>My Cats are one!</p>
  </dd>
</dl>
`

tap.test('getBlogListHtml', t => {
  const actual = getBlogListHtml(data)
  t.equal(expected, actual)
})