import { FC } from 'react'
import { TComponentConfig } from 'autoprops'
import { TAnyObject } from 'tsfn'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { TComponents, TPackageJson } from '../types'

export type TMetaState = {
  components?: TComponents,
  Component?: FC<any>,
  componentConfig?: TComponentConfig,
  componentProps?: Readonly<TAnyObject>,
  componentPropsChildrenMap?: Readonly<TAnyObject>,
  packageJson?: TPackageJson,
  componentKey: string | null,
  propsIndex?: string,
}

export type TMetaDispatch = ThunkDispatch<TMetaState, undefined, AnyAction>
