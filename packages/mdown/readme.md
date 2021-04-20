# mdown ![npm](https://flat.badgen.net/npm/v/mdown)

Markdown to React.

## Install

```sh
$ yarn add mdown
```

## Usage

```ts
type TMarkdownToReactConfig = {
  blockquote?: FC<TComponentBlockquote>,
  code?: FC<TComponentCode>,
  codespan?: FC<TComponentCodespan>,
  del?: FC<TComponentDel>,
  em?: FC<TComponentEm>,
  heading?: FC<TComponentHeading>,
  hr?: FC<TComponentHr>,
  image?: FC<TComponentImage>,
  link?: FC<TComponentLink>,
  list?: FC<TComponentList>,
  listItem?: FC<TComponentListItem>,
  paragraph?: FC<TComponentParagraph>,
  strong?: FC<TComponentStrong>,
  table?: FC<TComponentTable>,
  tableCell?: FC<TComponentTableCell>,
  tableHeaderCell?: FC<TComponentTableHeaderCell>,
  tableRow?: FC<TComponentTableRow>,
  text?: FC<TComponentText>
}

const markdownToReact: (makrdown: string, config: TMarkdownToReactConfig) => ReactNode
```

```tsx
import { Fragment } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { markdownToReact } from 'mdown'

const markdown = '_**em**_'
const config = {
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
}
const html = renderToStaticMarkup(
  <Fragment>
    { markdownToReact(markdown, config) }
  </Fragment>
)

console.log(html)
// <p><em><strong><span>em</span></strong></em></p>
```
