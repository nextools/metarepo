import { FC } from 'react'
import { TAnyObject, TKeyOf, TRequiredKeys, TOptionalKeys } from 'tsfn'
import { BigInteger } from 'big-integer'

export type TMetaFile<T = any> = {
  Component: FC<T>,
  config: TComponentConfig<T>,
  childrenConfig?: TChildrenConfig,
}

export type TChildrenConfig = {
  meta: {
    [K in string]: TMetaFile
  },
  children: string[],
  mutex?: string[][],
  mutin?: string[][],
  required?: string[],
}

export type TComponentConfig<T = TAnyObject> = {
  props: {
    [k in Exclude<TRequiredKeys<T>, 'children'>]: T[k][];
  } & {
    [k in TOptionalKeys<T> | Extract<keyof T, 'children'>]?: (Exclude<T[k], undefined>)[];
  },
  required?: TRequiredKeys<T>[],
  mutex?: TKeyOf<T>[][],
  mutin?: TKeyOf<T>[][],
}

export type TChildrenMap = {
  [K in string]?: TAnyObject
}

export type Permutation = {
  values: BigInteger[],
  length: BigInteger[],
  propKeys: string[],
}
