import { ReactNode } from 'react'

// no body - no tail
export type TSerializedElement = {
  head: ReactNode, // shared old line
  body: ReactNode, // self added line(s)
  tail: ReactNode, // shared new line
}

export type TElementFactory = (children: ReactNode) => ReactNode

export type TConfig = {
  indent: number,
  maxChildrenDepth: number,
  whitespaceChar: string,
  components: {
    Root: TElementFactory,
    Line: TElementFactory,
    ArrayComma: TElementFactory,
    ArrayBracket: TElementFactory,
    Comment: TElementFactory,
    CommentBrace: TElementFactory,
    ComponentBracket: TElementFactory,
    ComponentName: TElementFactory,
    ObjectBrace: TElementFactory,
    ObjectColon: TElementFactory,
    ObjectKey: TElementFactory,
    ObjectComma: TElementFactory,
    PropsBrace: TElementFactory,
    PropsEquals: TElementFactory,
    PropsKey: TElementFactory,
    Quote: TElementFactory,
    ValueBoolean: TElementFactory,
    ValueFunction: TElementFactory,
    ValueNull: TElementFactory,
    ValueNumber: TElementFactory,
    ValueString: TElementFactory,
    Whitespace: TElementFactory,
  },
}
