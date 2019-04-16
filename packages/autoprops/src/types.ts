export type TProps = {}

export type PropsWithValues<P extends TProps> = {
  [K in keyof P]: P[K][]
}

export type MutexGroup<T extends TProps> = (keyof T)[]

export interface AutoConfig<T extends TProps> {
  props: PropsWithValues<T>,
  mutex?: MutexGroup<T>[],
}

export interface AutoResult<T extends TProps> {
  props: T[],
  fileNames: string[],
  requestParams: string[],
}

export interface Permutation<T extends TProps> extends Array<number> {
  __PERMUTATION__: T,
}

export interface LengthPermutation<T extends TProps> extends Array<number> {
  __LENGTH_PERMUTATION__: T,
}

export interface Keys<T extends TProps> extends Array<keyof T> {
  __KEYS__: T,
}
