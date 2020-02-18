import React from 'react'
import { TComponentConfig } from 'autoprops'
import { TAnyObject } from 'tsfn'
import { component, startWithType } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { SYMBOL_COMPONENT_CONTROLS_BLOCK } from '../../symbols'
import { PropsItem } from './PropsItem'

export type TPropsBlock = {
  componentConfig: TComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  propPath: readonly string[],
  propKeys: readonly string[],
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const PropsBlock = component(
  startWithType<TPropsBlock>()
)(({
  componentConfig,
  componentPropsChildrenMap,
  propPath,
  propKeys,
  onChange,
}) => (
  <Layout direction="vertical" vPadding={10}>
    {propKeys.map((propName, rowIndex) => (
      <Layout_Item key={rowIndex} height={40}>
        <PropsItem
          name={propName}
          propPath={[...propPath, propName]}
          possibleValues={componentConfig.props[propName]}
          value={componentPropsChildrenMap[propName]}
          isRequired={Array.isArray(componentConfig.required) && componentConfig.required.includes(propName)}
          onChange={onChange}
        />
      </Layout_Item>
    ))}
  </Layout>
))

PropsBlock.displayName = 'PropsBlock'
PropsBlock.componentSymbol = SYMBOL_COMPONENT_CONTROLS_BLOCK
