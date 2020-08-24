import type { TCommonComponentConfig } from 'autoprops'
import type { FC } from 'react'
import type { AnyAction } from 'redux'
import type { ThunkDispatch } from 'redux-thunk'
import type { TAnyObject } from 'tsfn'
import type { TComponents, TPackageJson, TCommonComponentControls } from '../types'

export type TMetaState = {
  components: TComponents | null,
  // Key - Index group
  componentKey: string | null, // Key value
  propsIndex: string,
  selectedElementPath: string,
  // component group, depends on 'components' and 'componentKey'
  componentConfig: TCommonComponentConfig | null,
  componentControls: TCommonComponentControls | null,
  Component: FC<any> | null,
  componentProps: Readonly<TAnyObject>,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  // packageJson group
  packageJson: TPackageJson | null,
}

export type TMetaDispatch = ThunkDispatch<TMetaState, undefined, AnyAction>
