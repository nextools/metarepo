const INDENT = 2

export const nextIndent = (indent: number) => indent + INDENT

export const prevIndent = (indent: number) => indent - INDENT

export const makeIndent = (indent: number) => ' '.repeat(Math.max(indent, 0))
