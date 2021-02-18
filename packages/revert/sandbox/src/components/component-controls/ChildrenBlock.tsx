import { Layout, Layout_Item } from '@revert/layout'
import { isChildrenMap } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun'
import type { TAnyObject } from 'tsfn'
import { SYMBOL_COMPONENT_CONTROLS_BLOCK } from '../../symbols'
import { getComponentName } from '../../utils'
import { ChildItem } from './ChildItem'

export type TChildrenBlock = {
  componentConfig: TCommonComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  propPath: readonly string[],
  childrenKeys: readonly string[],
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const ChildrenBlock = component(
  startWithType<TChildrenBlock>()
)(({
  componentConfig,
  childrenKeys,
  componentPropsChildrenMap,
  propPath,
  onChange,
}) => (
  <Layout direction="vertical" vPadding={10}>
    {childrenKeys.map((childKey, rowIndex) => (
      <Layout_Item key={rowIndex} height={40}>
        <ChildItem
          name={getComponentName(componentConfig.children![childKey]!.Component)}
          isRequired={Array.isArray(componentConfig.required) && componentConfig.required.includes(childKey)}
          isActive={isChildrenMap(componentPropsChildrenMap.children) && Reflect.has(componentPropsChildrenMap.children, childKey)}
          propPath={[...propPath, childKey]}
          onChange={onChange}
        />
      </Layout_Item>
    ))}
  </Layout>
))

ChildrenBlock.displayName = 'PropsBlock'
ChildrenBlock.componentSymbol = SYMBOL_COMPONENT_CONTROLS_BLOCK
