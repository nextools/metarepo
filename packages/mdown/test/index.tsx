import dedent from 'dedent'
import { Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import test from 'tape'
import { markdownToReact } from '../src/markdown-to-react'
import type { TMarkdownToReactConfig } from '../src/types'

const toHtml = (markdown: string, config: TMarkdownToReactConfig): string => {
  return renderToStaticMarkup(
    <Fragment>
      { markdownToReact(markdown, config) }
    </Fragment>
  )
}

const minHtml = (html: string): string => html.replace(/\n+[\s\t]+/g, '')

test('mdown: blockquote', (t) => {
  const md = dedent(`
    >blockquote1
    >blockquote2
  `)
  const html = toHtml(md, {
    blockquote: ({ children }) => (
      <blockquote>{ children }</blockquote>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <blockquote>
        <p>
          <span>blockquote1\nblockquote2</span>
        </p>
      </blockquote>
    `),
    'should work'
  )

  t.end()
})

test('mdown: blockquote error', (t) => {
  const md = '>blockquote'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "blockquote" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: code', (t) => {
  const md = dedent(`
    \`\`\`js
    code "1"
    code 2
    \`\`\`
  `)
  const html = toHtml(md, {
    code: ({ lang, children }) => (
      <pre title={lang}>
        { children }
      </pre>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <pre title="js">
        code &quot;1&quot;\ncode 2
      </pre>
    `),
    'should work'
  )

  t.end()
})

test('mdown: code error', (t) => {
  const md = '```\ncode\n```'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "code" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: codespan', (t) => {
  const md = '`code "1" code &2`'
  const html = toHtml(md, {
    codespan: ({ children }) => (
      <code>{ children }</code>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <code>code &quot;1&quot; code &amp;2</code>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: codespan error', (t) => {
  const md = '`code 1 code 2`'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "codespan" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: del', (t) => {
  const md = '~del 1 _del `2`_~'
  const html = toHtml(md, {
    del: ({ children }) => (
      <del>{ children }</del>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    codespan: ({ children }) => (
      <code>{ children }</code>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <del>
          <span>del 1 </span>
          <em>
            <span>del </span>
            <code>2</code>
          </em>
        </del>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: del error', (t) => {
  const md = '~del~'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "del" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: em', (t) => {
  const md = '_**em**_'
  const html = toHtml(md, {
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <em>
          <strong>
            <span>em</span>
          </strong>
        </em>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: em error', (t) => {
  const md = '_em_'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "em" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: heading', (t) => {
  const md = dedent(`
    # _title 1_
    ## **title 2**
  `)
  const html = toHtml(md, {
    heading: ({ depth, children }) => {
      switch (depth) {
        case 1: {
          return (
            <h1>{ children }</h1>
          )
        }
        case 2: {
          return (
            <h2>{ children }</h2>
          )
        }
        default: {
          return (
            <h6>{ children }</h6>
          )
        }
      }
    },
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <h1>
        <em>
          <span>title 1</span>
        </em>
      </h1>
      <h2>
        <strong>
          <span>title 2</span>
        </strong>
      </h2>
    `),
    'should work'
  )

  t.end()
})

test('mdown: heading error', (t) => {
  const md = '# title'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "heading" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: hr', (t) => {
  const md = '---'
  const html = toHtml(md, {
    hr: () => (
      <hr/>
    ),
  })

  t.equal(
    html,
    '<hr/>',
    'should work'
  )

  t.end()
})

test('mdown: hr error', (t) => {
  const md = '---'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "hr" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: image', (t) => {
  const md = '![alt"](url)'
  const html = toHtml(md, {
    image: ({ alt, src }) => (
      <img src={src} alt={alt}/>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <img src="url" alt="alt&quot;"/>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: image error', (t) => {
  const md = '![alt](url)'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "image" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: link', (t) => {
  const md = dedent(`
    [_link 1_](url1) [**link 2**][1]

    [1]: url2
  `)
  const html = toHtml(md, {
    link: ({ url, children }) => (
      <a href={url}>
        { children }
      </a>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <a href="url1">
          <em>
            <span>link 1</span>
          </em>
        </a>
        <span> </span>
        <a href="url2">
          <strong>
            <span>link 2</span>
          </strong>
        </a>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: link error', (t) => {
  const md = '[alt](url)'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "link" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: list + listItem', (t) => {
  const md = dedent(`
    * item 1
    * item **2**
      1. item 2.1
    * item 3
    * [x] item 4
    * [ ] item 5
  `)
  const html = toHtml(md, {
    list: ({ isOrdered, children, depth }) => {
      if (isOrdered) {
        return (
          <ol title={String(depth)}>{ children }</ol>
        )
      }

      return (
        <ul title={String(depth)}>{ children }</ul>
      )
    },
    listItem: ({ children, isTask, isChecked }) => (
      <li>
        { isTask && (isChecked ? '[x] ' : '[ ] ') }{ children }
      </li>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <ul title="0">
        <li>
          <span>item 1</span>
        </li>
        <li>
            <span>item </span>
            <strong>
              <span>2</span>
            </strong>
            <ol title="1">
                <li>
                  <span>item 2.1</span>
                </li>
            </ol>
        </li>
        <li>
          <span>item 3</span>
        </li>
        <li>
          [x] <span>item 4</span>
        </li>
        <li>
          [ ] <span>item 5</span>
        </li>
      </ul>
    `),
    'should work'
  )

  t.end()
})

test('mdown: list error', (t) => {
  const md = '* item'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "list" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: listItem error', (t) => {
  const md = '* item'

  try {
    toHtml(md, {
      list: ({ children }) => (
        <ul>{ children }</ul>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "listItem" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: paragraph', (t) => {
  const md = 'para _graph_'
  const html = toHtml(md, {
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <span>para </span>
        <em>
          <span>graph</span>
        </em>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: list error', (t) => {
  const md = 'paragraph'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "paragraph" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: strong', (t) => {
  const md = '**_strong_**'
  const html = toHtml(md, {
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <strong>
          <em>
            <span>strong</span>
          </em>
        </strong>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: strong error', (t) => {
  const md = '**strong**'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "strong" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: table + row + header + cell', (t) => {
  const md = dedent(`
    | Table**s**    | Are           | Cool  |
    | ------------- |:-------------:| -----:|
    | col 3 is      | right-aligned | $1600 |
    | col 2 is      | centered      | _$12_ |
  `)
  const html = toHtml(md, {
    table: ({ children }) => (
      <table>{ children }</table>
    ),
    tableRow: ({ children }) => (
      <tr>{ children }</tr>
    ),
    tableHeaderCell: ({ align, children }) => (
      <th align={align}>
        { children }
      </th>
    ),
    tableCell: ({ align, children }) => (
      <td align={align}>
        { children }
      </td>
    ),
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    em: ({ children }) => (
      <em>{ children }</em>
    ),
    strong: ({ children }) => (
      <strong>{ children }</strong>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <table>
        <tr>
            <th align="left">
                <span>Table</span>
                <strong>
                  <span>s</span>
                </strong>
            </th>
            <th align="center">
              <span>Are</span>
            </th>
            <th align="right">
              <span>Cool</span>
            </th>
        </tr>
        <tr>
            <td align="left">
              <span>col 3 is</span>
            </td>
            <td align="center">
              <span>right-aligned</span>
            </td>
            <td align="right">
              <span>$1600</span>
            </td>
        </tr>
        <tr>
            <td align="left">
              <span>col 2 is</span>
            </td>
            <td align="center">
              <span>centered</span>
            </td>
            <td align="right">
              <em>
                <span>$12</span>
              </em>
            </td>
        </tr>
      </table>
    `),
    'should work'
  )

  t.end()
})

test('mdown: table error', (t) => {
  const md = dedent(`
    | table |
    | ----- |
    | cell  |
  `)

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "table" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: tableRow error', (t) => {
  const md = dedent(`
    | table |
    | ----- |
    | cell  |
  `)

  try {
    toHtml(md, {
      table: ({ children }) => (
        <table>{ children }</table>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "tableRow" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: tableHeaderCell error', (t) => {
  const md = dedent(`
    | table |
    | ----- |
    | cell  |
  `)

  try {
    toHtml(md, {
      table: ({ children }) => (
        <table>{ children }</table>
      ),
      tableRow: ({ children }) => (
        <tr>{ children }</tr>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "tableHeaderCell" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: tableCell error', (t) => {
  const md = dedent(`
    | table |
    | ----- |
    | cell  |
  `)

  try {
    toHtml(md, {
      table: ({ children }) => (
        <table>{ children }</table>
      ),
      tableRow: ({ children }) => (
        <tr>{ children }</tr>
      ),
      tableHeaderCell: ({ align, children }) => (
        <th align={align}>
          { children }
        </th>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "tableCell" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: text', (t) => {
  const md = 'text'
  const html = toHtml(md, {
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <span>text</span>
      </p>
    `),
    'should work'
  )

  t.end()
})

test('mdown: text error', (t) => {
  const md = 'text'

  try {
    toHtml(md, {
      paragraph: ({ children }) => (
        <p>{ children }</p>
      ),
    })

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "text" is unhandled',
      'should throw'
    )
  }

  t.end()
})

test('mdown: unsupported error', (t) => {
  const md = '<br/>'

  try {
    toHtml(md, {})

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Token type "html" is not supported',
      'should throw'
    )
  }

  t.end()
})

test('mdown: escaped symbols', (t) => {
  const md = '"&<>'

  const html = toHtml(md, {
    text: ({ children }) => (
      <span>{ children }</span>
    ),
    paragraph: ({ children }) => (
      <p>{ children }</p>
    ),
  })

  t.equal(
    html,
    minHtml(`
      <p>
        <span>&quot;&amp;</span>
        <span>&lt;&gt;</span>
      </p>
    `),
    'should work'
  )

  t.end()
})
