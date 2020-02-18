import React from 'react'
import { serializeComponent } from 'syntx'
import { startWithType, pureComponent } from 'refun'
import { isUndefined } from 'tsfn'
import { SYMBOL_SOURCE_CODE } from '../../symbols'
import { Scroll } from '../scroll'
import { mapMetaStoreState } from '../../store-meta'
import { LinesBlock } from './LinesBlock'
import { createChildrenMeta } from './create-children-meta'

export type TSourceCode = {
  copyImportPackageName?: string,
}

export const SourceCode = pureComponent(
  startWithType<TSourceCode>(),
  mapMetaStoreState(({ Component, componentConfig, componentProps, componentPropsChildrenMap }) => {
    if (isUndefined(componentProps)) {
      return {
        lines: [],
      }
    }

    return {
      lines: serializeComponent(Component!, componentProps!, {
        indent: 2,
        meta: createChildrenMeta(componentConfig!, componentPropsChildrenMap!),
      }),
    }
  }, ['Component', 'componentConfig', 'componentProps', 'componentPropsChildrenMap'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={lines}/>
  </Scroll>
))

SourceCode.displayName = 'SourceCode'
SourceCode.componentSymbol = SYMBOL_SOURCE_CODE
