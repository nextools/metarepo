import { Scroll } from '@revert/scroll'
import { startWithType, pureComponent, mapWithPropsMemo } from 'refun'
import { mapMetaStoreState } from '../../store-meta'
import { SYMBOL_SOURCE_IMPORTS } from '../../symbols'
import { LinesBlock } from './LinesBlock'
import { serializeImportsLines } from './serialize-imports-lines'

export type TSourceImports = {
  getImportPackageName: (symbolName: string) => string,
}

export const SourceImports = pureComponent(
  startWithType<TSourceImports>(),
  mapMetaStoreState(({ Component, componentProps }) => ({
    Component,
    componentProps,
  }), ['Component', 'componentProps']),
  mapWithPropsMemo(({ Component, componentProps, getImportPackageName }) => ({
    lines: Component !== null
      ? serializeImportsLines(Component, componentProps, getImportPackageName)
      : [],
  }), ['Component', 'componentProps', 'getImportPackageName'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically>
    <LinesBlock lines={lines}/>
  </Scroll>
))

SourceImports.displayName = 'SourceImports'
SourceImports.componentSymbol = SYMBOL_SOURCE_IMPORTS
