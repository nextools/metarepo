import { FC, ReactNode } from 'react'

// no body - no tail
export type TSerializedElement = {
  head: ReactNode, // shared old line
  body: ReactNode, // self added line(s)
  tail: ReactNode, // shared new line
}

export type TPathSegment = {
  name: string,
  index: number,
}

export type TPath = TPathSegment[]

export type TLine = {
  path: TPath,
  index?: number,
}

export type TConfig = {
  indent: number,
  whitespaceChar: string,
  components: {
    Root: FC<{}>,
    Line: FC<TLine>,
    ArrayComma: FC<{}>,
    ArrayBracket: FC<{}>,
    Comment: FC<{}>,
    CommentBrace: FC<{}>,
    ComponentBracket: FC<{}>,
    ComponentName: FC<{}>,
    ObjectBrace: FC<{}>,
    ObjectColon: FC<{}>,
    ObjectKey: FC<{}>,
    ObjectComma: FC<{}>,
    PropsBrace: FC<{}>,
    PropsEquals: FC<{}>,
    PropsKey: FC<{}>,
    Quote: FC<{}>,
    ValueBoolean: FC<{}>,
    ValueFunction: FC<{}>,
    ValueNull: FC<{}>,
    ValueNumber: FC<{}>,
    ValueString: FC<{}>,
    ValueSymbol: FC<{}>,
    Whitespace: FC<{}>,
  },
}
