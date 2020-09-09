import type { FC, ReactNode, ReactText } from 'react'

type TTokenBlockquote = {
  type: 'blockquote',
  tokens: TTokenParagraph[],
}

type TTokenCode = {
  type: 'code',
  lang?: string,
  text: string,
}

type TTokenCodespan = {
  type: 'codespan',
  text: string,
}

type TTokenDel = {
  type: 'del',
  tokens: (TTokenText | TTokenStrong | TTokenEm | TTokenCodespan | TTokenLink | TTokenImage)[],
}

type TTokenEm = {
  type: 'em',
  tokens: (TTokenText | TTokenStrong | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[],
}

type TTokenHeading = {
  type: 'heading',
  depth: number,
  tokens: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[],
}

type TTokenHr = {
  type: 'hr',
}

type TTokenImage = {
  type: 'image',
  href: string,
  text: string,
}

type TTokenLink = {
  type: 'link',
  href: string,
  tokens: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenImage)[],
}

type TTokenList = {
  type: 'list',
  ordered: boolean,
  items: TTokenListItem[],
}

type TTokenListItem = {
  type: 'list_item',
  task: false,
  checked?: boolean,
  tokens: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage | TTokenList | TTokenBlockquote)[],
}

type TTokenParagraph = {
  type: 'paragraph',
  tokens: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[],
}

type TTokenSpace = {
  type: 'space',
}

type TTokenStrong = {
  type: 'strong',
  tokens: (TTokenText | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[],
}

type TTokenTable = {
  type: 'table',
  align: ('left' | 'center' | 'right' | null)[],
  tokens: {
    header: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[][],
    cells: (TTokenText | TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[][][],
  },
}

type TTokenText = {
  type: 'text',
  text: string,
  tokens?: (TTokenStrong | TTokenEm | TTokenDel | TTokenCodespan | TTokenLink | TTokenImage)[],
}

export type TToken =
  TTokenBlockquote |
  TTokenCode |
  TTokenCodespan |
  TTokenDel |
  TTokenEm |
  TTokenHeading |
  TTokenHr |
  TTokenImage |
  TTokenLink |
  TTokenList |
  TTokenListItem |
  TTokenParagraph |
  TTokenSpace |
  TTokenStrong |
  TTokenTable |
  TTokenText

export type TComponentBlockquote = {
  children: ReactNode,
}

export type TComponentCode = {
  lang?: string,
  children: ReactText,
}

export type TComponentCodespan = {
  children: ReactText,
}

export type TComponentDel = {
  children: ReactNode,
}

export type TComponentEm = {
  children: ReactNode,
}

export type TComponentHeading = {
  depth: number,
  children: ReactNode,
}

export type TComponentHr = {}

export type TComponentImage = {
  alt: string,
  src: string,
}

export type TComponentLink = {
  url: string,
  children: ReactNode,
}

export type TComponentList = {
  isOrdered: boolean,
  children: ReactNode,
}

export type TComponentListItem = {
  isTask: boolean,
  isChecked: boolean,
  children: ReactNode,
}

export type TComponentParagraph = {
  children: ReactNode,
}

export type TComponentStrong = {
  children: ReactNode,
}

export type TComponentTable = {}

export type TComponentTableCell = {
  align: 'left' | 'center' | 'right',
}

export type TComponentTableHeaderCell = {
  align: 'left' | 'center' | 'right',
}

export type TComponentTableRow = {}

export type TComponentText = {
  children: ReactText,
}

export type TMarkdownToReactConfig = {
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
  text?: FC<TComponentText>,
}
