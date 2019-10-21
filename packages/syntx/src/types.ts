export type TMeta = {
  readonly value: any,
  readonly children?: readonly TMeta[],
}

export type TLineElement = {
  readonly type: string,
  readonly value: string,
}

export type TLine = {
  readonly meta?: any,
  readonly elements: readonly TLineElement[],
}

// no body - no tail
export type TSerializedElement = {
  readonly head: readonly TLineElement[], // shared old line
  readonly body: readonly TLine[], // self added line(s)
  readonly tail: readonly TLineElement[], // shared new line
}

export type TConfig = {
  readonly indent: number,
  readonly meta?: TMeta,
}
