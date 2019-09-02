import { FC } from 'react'
import { TAnyObject, TExtend, TKeyOf, TRequiredKeys } from 'tsfn'
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
  props: TExtend<{
    [k in keyof T]: T[k][]
  }, {
    [k in Extract<keyof T, 'children'>]?: T[k][]
  }>,
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
}
