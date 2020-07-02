import { BigInteger } from 'big-integer'
import { FC } from 'react'
import { TAnyObject, TKeyOf, TRequiredKeys, TOptionalKeys, TReadonly } from 'tsfn'

export type TCommonRequiredConfig = string[]
export type TCommonMutexConfig = string[][]
export type TCommonDepsConfig = {
  [K: string]: string[] | undefined,
}

export type TCommonComponentConfig = {
  props: {
    [K: string]: any[] | undefined,
  },
  children?: {
    [K: string]: {
      Component: FC<any>,
      config: TCommonComponentConfig,
    } | undefined,
  },
  required?: string[],
  mutex?: string[][],
  deps?: {
    [K: string]: string[] | undefined,
  },
}

export type TComponentConfig<TProps, TChildrenKeys extends string = never> = {
  props: {
    [K in Exclude<TRequiredKeys<TProps>, 'children'>]: TProps[K][];
  } & {
    [K in TOptionalKeys<TProps> | Extract<keyof TProps, 'children'>]?: (Exclude<TProps[K], undefined>)[];
  },
  children?: {
    [K in TChildrenKeys]: {
      Component: FC<any>,
      config: TCommonComponentConfig,
    }
  },
  required?: (TKeyOf<TProps> | TChildrenKeys)[],
  mutex?: (TKeyOf<TProps> | TChildrenKeys)[][],
  deps?: {
    [K in TKeyOf<TProps> | TChildrenKeys]?: (TKeyOf<TProps> | TChildrenKeys)[]
  },
}

export type TChildrenMap = {
  [K: string]: (Readonly<TAnyObject>) | undefined,
}

export type TPermutationConfig = {
  lengths: BigInteger[],
  propKeys: string[],
  childrenKeys: string[],
}

export type TPermutation = TPermutationConfig & {
  values: BigInteger[],
}

export type TCheckPermFn = (values: readonly BigInteger[], permConfig: TReadonly<TPermutationConfig>, componentConfig: TCommonComponentConfig) => readonly BigInteger[] | null
export type TApplyRestrictionFn = (mutValues: BigInteger[], changedPropName: string, permConfig: TReadonly<TPermutationConfig>, componentConfig: TCommonComponentConfig) => void
