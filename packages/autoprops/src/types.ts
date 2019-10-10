import { FC } from 'react'
import { TAnyObject, TKeyOf, TRequiredKeys, TOptionalKeys } from 'tsfn'
import { BigInteger } from 'big-integer'

export type TMetaFile<T = any> = {
  Component: FC<T>,
  config: TComponentConfig<T>,
  childrenConfig?: TChildrenConfig,
}

export type TChildrenConfig<ChildrenKeys extends string = string> = {
  meta: {
    [K in ChildrenKeys]: TMetaFile
  },
  children: ChildrenKeys[],
  mutex?: ChildrenKeys[][],
  mutin?: ChildrenKeys[][],
  required?: ChildrenKeys[],
}

export type TComponentConfig<T = TAnyObject, ChildrenKeys extends string = never> = {
  props: {
    [k in Exclude<TRequiredKeys<T>, 'children'>]: T[k][];
  } & {
    [k in TOptionalKeys<T> | Extract<keyof T, 'children'>]?: (Exclude<T[k], undefined>)[];
  },
  required?: TRequiredKeys<T>[],
  mutex?: (TKeyOf<T> | ChildrenKeys)[][],
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
