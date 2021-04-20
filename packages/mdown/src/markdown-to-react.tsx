import marked from 'marked'
import type { ReactNode } from 'react'
import type { TMarkdownToReactConfig, TToken } from './types'

const htmlUnescape = (htmlString: string) => htmlString
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&#0?39;/g, '\'')
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')

export const markdownToReact = (makrdown: string, config: TMarkdownToReactConfig): ReactNode => {
  const tokens = marked.lexer(makrdown, {
    gfm: true,
    breaks: false,
  }) as TToken[]

  const mapTokens = (tokens: TToken[], depth = 0): ReactNode => {
    return tokens
      .filter((token) => token.type !== 'space')
      .map((token, i) => {
        switch (token.type) {
          case 'blockquote': {
            if (typeof config.blockquote !== 'function') {
              throw new Error('Token type "blockquote" is unhandled')
            }

            return (
              <config.blockquote key={i}>
                { mapTokens(token.tokens) }
              </config.blockquote>
            )
          }

          case 'code': {
            if (typeof config.code !== 'function') {
              throw new Error('Token type "code" is unhandled')
            }

            return (
              <config.code key={i} lang={token.lang}>
                { htmlUnescape(token.text) }
              </config.code>
            )
          }

          case 'codespan': {
            if (typeof config.codespan !== 'function') {
              throw new Error('Token type "codespan" is unhandled')
            }

            return (
              <config.codespan key={i}>
                { htmlUnescape(token.text) }
              </config.codespan>
            )
          }

          case 'del': {
            if (typeof config.del !== 'function') {
              throw new Error('Token type "del" is unhandled')
            }

            return (
              <config.del key={i}>
                { mapTokens(token.tokens) }
              </config.del>
            )
          }

          case 'em': {
            if (typeof config.em !== 'function') {
              throw new Error('Token type "em" is unhandled')
            }

            return (
              <config.em key={i}>
                { mapTokens(token.tokens) }
              </config.em>
            )
          }

          case 'heading': {
            if (typeof config.heading !== 'function') {
              throw new Error('Token type "heading" is unhandled')
            }

            return (
              <config.heading key={i} depth={token.depth}>
                { mapTokens(token.tokens) }
              </config.heading>
            )
          }

          case 'hr': {
            if (typeof config.hr !== 'function') {
              throw new Error('Token type "hr" is unhandled')
            }

            return (
              <config.hr key={i}/>
            )
          }

          case 'image': {
            if (typeof config.image !== 'function') {
              throw new Error('Token type "image" is unhandled')
            }

            return (
              <config.image
                key={i}
                alt={htmlUnescape(token.text)}
                src={token.href}
              />
            )
          }

          case 'link': {
            if (typeof config.link !== 'function') {
              throw new Error('Token type "link" is unhandled')
            }

            return (
              <config.link key={i} url={token.href}>
                { mapTokens(token.tokens) }
              </config.link>
            )
          }

          case 'list': {
            if (typeof config.list !== 'function') {
              throw new Error('Token type "list" is unhandled')
            }

            return (
              <config.list
                key={i}
                isOrdered={token.ordered}
                depth={depth}
              >
                { mapTokens(token.items, depth) }
              </config.list>
            )
          }

          case 'list_item': {
            if (typeof config.listItem !== 'function') {
              throw new Error('Token type "listItem" is unhandled')
            }

            return (
              <config.listItem
                key={i}
                isTask={token.task}
                isChecked={Boolean(token.checked)}
              >
                { mapTokens(token.tokens, depth + 1) }
              </config.listItem>
            )
          }

          case 'paragraph': {
            if (typeof config.paragraph !== 'function') {
              throw new Error('Token type "paragraph" is unhandled')
            }

            return (
              <config.paragraph key={i}>
                { mapTokens(token.tokens) }
              </config.paragraph>
            )
          }

          case 'strong': {
            if (typeof config.strong !== 'function') {
              throw new Error('Token type "strong" is unhandled')
            }

            return (
              <config.strong key={i}>
                { mapTokens(token.tokens) }
              </config.strong>
            )
          }

          case 'table': {
            if (typeof config.table !== 'function') {
              throw new Error('Token type "table" is unhandled')
            }

            if (typeof config.tableRow !== 'function') {
              throw new Error('Token type "tableRow" is unhandled')
            }

            if (typeof config.tableHeaderCell !== 'function') {
              throw new Error('Token type "tableHeaderCell" is unhandled')
            }

            if (typeof config.tableCell !== 'function') {
              throw new Error('Token type "tableCell" is unhandled')
            }

            const HeaderCell = config.tableHeaderCell
            const Row = config.tableRow
            const Cell = config.tableCell

            return (
              <config.table key={i}>
                <Row>
                  {
                    token.tokens.header.map((cell, k) => (
                      <HeaderCell key={k} align={token.align[k] ?? 'left'}>
                        { mapTokens(cell) }
                      </HeaderCell>
                    ))
                  }
                </Row>
                {
                  token.tokens.cells.map((row, k) => (
                    <Row key={k}>
                      {
                        row.map((cell, j) => (
                          <Cell key={j} align={token.align[j] ?? 'left'}>
                            { mapTokens(cell) }
                          </Cell>
                        ))
                      }
                    </Row>
                  ))
                }
              </config.table>
            )
          }

          case 'text': {
            if (typeof config.text !== 'function') {
              throw new Error('Token type "text" is unhandled')
            }

            if (Array.isArray(token.tokens)) {
              return mapTokens(token.tokens)
            }

            return (
              <config.text key={i}>
                { htmlUnescape(token.text) }
              </config.text>
            )
          }

          default: {
            throw new Error(`Token type "${token.type}" is not supported`)
          }
        }
      })
  }

  return mapTokens(tokens)
}
