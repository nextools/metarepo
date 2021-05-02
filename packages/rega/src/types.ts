export type TRegisterOptions = {
  name: string,
  fromPort: number,
  toPort: number,
  deps?: string[],
}

export type TDeps = {
  [k: string]: number,
}

export type TRegisterResult = {
  port: number,
  deps?: TDeps,
}

export type TResolver = (port: number) => void
export type TRejecter = (err: any) => void
export type TExecutors = Set<[TResolver, TRejecter]>
