export type TPathSegment = {
  name: string,
  index: number,
}

export type TPath = TPathSegment[]

export type TLineElement = {
  type: symbol,
  value: any,
}

export type TLine = {
  path: TPath,
  elements: TLineElement[],
}

// no body - no tail
export type TSerializedElement = {
  head: TLineElement[], // shared old line
  body: TLine[], // self added line(s)
  tail: TLineElement[], // shared new line
}

export type TConfig = {
  indent: number,
}
