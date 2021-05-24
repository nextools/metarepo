export type TStartServerOptions = {
  fromPort: number,
  toPort: number,
}

export type TRegisterServiceOptions = {
  name: string,
  deps?: string[],
}

export type TDepsMap = {
  [k: string]: number,
}

export type TRegisterServiceResult = {
  port: number,
  deps?: TDepsMap,
}

export type TResolver = (port: number) => void
export type TRejecter = (err: any) => void
export type TExecutors = Set<[TResolver, TRejecter]>
