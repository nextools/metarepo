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
  description?: string,
}

export type TDoc = {
  description?: string,
  tags?: TTag[],
}

export type TResult = {
  type: 'arrow-function' | 'type-alias',
  source: string,
  doc?: TDoc,
}
