import { FC } from 'react'
import { TAnyObject, TKeyOf, TRequiredKeys, TOptionalKeys } from 'tsfn'
import { BigInteger } from 'big-integer'

export type TRequiredConfig <TProps = any, TChildrenKeys extends string = string> = readonly (TRequiredKeys<TProps> | TChildrenKeys)[]
export type TMutexConfig <TProps = any, TChildrenKeys extends string = string> = readonly (readonly (TKeyOf<TProps> | TChildrenKeys)[])[]
export type TMutinConfig <TProps = any, TChildrenKeys extends string = string> = readonly (readonly (TKeyOf<TProps> | TChildrenKeys)[])[]

export type TComponentConfig<TProps = any, TChildrenKeys extends string = string> = {
  readonly props: {
    readonly [k in Exclude<TRequiredKeys<TProps>, 'children'>]: readonly TProps[k][];
  } & {
    readonly [k in TOptionalKeys<TProps> | Extract<keyof TProps, 'children'>]?: readonly (Exclude<TProps[k], undefined>)[];
  },
  readonly children?: {
    readonly [K in TChildrenKeys]: {
      readonly Component: FC<any>,
      readonly config: TComponentConfig,
    }
  },
  readonly required?: TRequiredConfig<TProps, TChildrenKeys>,
  readonly mutex?: TMutexConfig<TProps, TChildrenKeys>,
  readonly mutin?: TMutinConfig<TProps, TChildrenKeys>,
}

export type TChildrenMap<TChildrenKeys extends string = string> = {
  readonly [K in TChildrenKeys]?: Readonly<TAnyObject>
}

export type Permutation = Readonly<{
  values: BigInteger[],
  length: readonly BigInteger[],
  propKeys: readonly string[],
  childrenKeys: readonly string[],
}>
