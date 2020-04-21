import { FC } from 'react'
import { TAnyObject, TKeyOf, TRequiredKeys, TOptionalKeys } from 'tsfn'
import { BigInteger } from 'big-integer'

export type TCommonRequiredConfig = readonly string[]
export type TCommonMutexConfig = readonly (readonly string[])[]
export type TCommonMutinConfig = readonly (readonly string[])[]

export type TCommonComponentConfig = {
  readonly props: {
    readonly [K: string]: (readonly any[]) | undefined,
  },
  readonly children?: {
    readonly [K: string]: {
      readonly Component: FC<any>,
      readonly config: TCommonComponentConfig,
    },
  },
  readonly required?: readonly string[],
  readonly mutex?: readonly (readonly string[])[],
  readonly mutin?: readonly (readonly string[])[],
}

export type TComponentConfig<TProps, TChildrenKeys extends string = never> = {
  readonly props: {
    readonly [K in Exclude<TRequiredKeys<TProps>, 'children'>]: readonly TProps[K][];
  } & {
    readonly [K in TOptionalKeys<TProps> | Extract<keyof TProps, 'children'>]?: readonly (Exclude<TProps[K], undefined>)[];
  },
  readonly children?: {
    readonly [K in TChildrenKeys]: {
      readonly Component: FC<any>,
      readonly config: TCommonComponentConfig,
    }
  },
  readonly required?: readonly (TRequiredKeys<TProps> | TChildrenKeys)[],
  readonly mutex?: readonly (readonly (TKeyOf<TProps> | TChildrenKeys)[])[],
  readonly mutin?: readonly (readonly (TKeyOf<TProps> | TChildrenKeys)[])[],
}

export type TChildrenMap = {
  readonly [K: string]: (Readonly<TAnyObject>) | undefined,
}

export type Permutation = Readonly<{
  values: BigInteger[],
  length: readonly BigInteger[],
  propKeys: readonly string[],
  childrenKeys: readonly string[],
}>
