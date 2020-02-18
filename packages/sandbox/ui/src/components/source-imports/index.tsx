import React from 'react'
import { startWithType, pureComponent, mapWithPropsMemo } from 'refun'
import { isUndefined } from 'tsfn'
import { SYMBOL_SOURCE_IMPORTS } from '../../symbols'
import { Scroll } from '../scroll'
import { mapMetaStoreState } from '../../store-meta'
import { LinesBlock } from './LinesBlock'
import { serializeImportsLines } from './serialize-imports-lines'

export type TSourceImports = {
  importPackageName: string,
}

export const SourceImports = pureComponent(
  startWithType<TSourceImports>(),
  mapMetaStoreState(({ Component, componentProps }) => ({
    Component,
    componentProps,
  }), ['Component', 'componentProps']),
  mapWithPropsMemo(({ Component, componentProps, importPackageName }) => {
    if (isUndefined(Component)) {
      return {
        lines: [],
      }
    }

    return {
      lines: serializeImportsLines(Component, componentProps, importPackageName),
    }
  }, ['Component', 'componentProps', 'importPackageName'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={lines}/>
  </Scroll>
))

SourceImports.displayName = 'SourceImports'
SourceImports.componentSymbol = SYMBOL_SOURCE_IMPORTS
