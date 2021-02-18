import { Scroll } from '@revert/scroll'
import { startWithType, pureComponent } from 'refun'
import { serializeComponent } from 'syntx'
import { mapMetaStoreState } from '../../store-meta'
import { SYMBOL_SOURCE_CODE } from '../../symbols'
import { LinesBlock } from './LinesBlock'
import { createChildrenMeta } from './create-children-meta'

export type TSourceCode = {
  copyImportPackageName?: string,
}

export const SourceCode = pureComponent(
  startWithType<TSourceCode>(),
  mapMetaStoreState(({ Component, componentConfig, componentProps, componentPropsChildrenMap }) => {
    if (Component === null || componentConfig === null) {
      return {
        lines: [],
      }
    }

    return {
      lines: serializeComponent(Component, componentProps, {
        indent: 2,
        meta: createChildrenMeta(componentConfig, componentPropsChildrenMap),
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
