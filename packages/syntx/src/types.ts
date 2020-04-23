export type TMeta = {
  value: any,
  children?: TMeta[],
}

export type TLineElement = {
  type: string,
  value: string,
}

export type TLine = {
  meta?: any,
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
  meta?: TMeta,
}
