import type { Node, Identifier } from 'typescript'

export type TNode = Node & {
  jsDoc?: {
    comment?: string,
    tags?: {
      tagName: Identifier,
      name?: Identifier,
      comment?: string,
    }[],
    getText: () => string,
  }[],
}

export type TTag = {
  tag: string,
  name?: string,
  comment?: string,
}

export type TJSDoc = {
  comment?: string,
  tags?: TTag[],
}
