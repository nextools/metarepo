import { Layout, Layout_Item } from '@revert/layout'
import type { TCommonComponentConfig } from 'autoprops'
import { component, startWithType, mapWithPropsMemo } from 'refun'
import type { TAnyObject } from 'tsfn'
import { SYMBOL_COMPONENT_CONTROLS_BLOCK } from '../../symbols'
import type { TCommonComponentControls } from '../../types'
import { PropsItem } from './PropsItem'

export type TPropsBlock = {
  componentConfig: TCommonComponentConfig,
  componentControls: TCommonComponentControls | null,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  propPath: readonly string[],
  propKeys: readonly string[],
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const PropsBlock = component(
  startWithType<TPropsBlock>(),
  mapWithPropsMemo(({ propPath, propKeys }) => ({
    propPaths: propKeys.map((key) => [...propPath, key]),
  }), ['propPath', 'propKeys'])
)(({
  componentConfig,
  componentControls,
  componentPropsChildrenMap,
  propPaths,
  propKeys,
  onChange,
}) => (
  <Layout direction="vertical" vPadding={10}>
    {propKeys.map((propName, rowIndex) => (
      <Layout_Item key={rowIndex} height={40}>
        <PropsItem
          name={propName}
          propPath={propPaths[rowIndex]}
          possibleValues={componentConfig.props[propName]!}
          controlSymbol={componentControls?.[propName]}
          value={componentPropsChildrenMap[propName]}
          isRequired={Boolean(componentConfig.required?.includes(propName))}
          onChange={onChange}
        />
      </Layout_Item>
    ))}
  </Layout>
))

PropsBlock.displayName = 'PropsBlock'
PropsBlock.componentSymbol = SYMBOL_COMPONENT_CONTROLS_BLOCK
