import { Layout, Layout_Item } from '@revert/layout'
import type { TCommonComponentConfig } from 'autoprops'
import { component, startWithType } from 'refun'
import type { TAnyObject } from 'tsfn'
import { SYMBOL_COMPONENT_CONTROLS_BLOCK } from '../../symbols'
import { HandlerItem } from './HandlerItem'

export type THandlersBlock = {
  componentConfig: TCommonComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  propPath: readonly string[],
  handlerKeys: readonly string[],
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const HandlersBlock = component(
  startWithType<THandlersBlock>()
)(({
  componentConfig,
  componentPropsChildrenMap,
  propPath,
  handlerKeys,
  onChange,
}) => (
  <Layout direction="vertical" vPadding={10}>
    {handlerKeys.map((propName, rowIndex) => (
      <Layout_Item key={rowIndex} height={40}>
        <HandlerItem
          name={propName}
          propPath={[...propPath, propName]}
          isRequired={Array.isArray(componentConfig.required) && componentConfig.required.includes(propName)}
          possibleValues={componentConfig.props[propName]!}
          value={componentPropsChildrenMap[propName]}
          onChange={onChange}
        />
      </Layout_Item>
    ))}
  </Layout>
))

HandlersBlock.displayName = 'PropsBlock'
HandlersBlock.componentSymbol = SYMBOL_COMPONENT_CONTROLS_BLOCK
