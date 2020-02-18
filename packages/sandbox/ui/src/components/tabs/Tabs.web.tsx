import React, { ReactNode } from 'react'
import { component, startWithType, mapState, onChange, mapContext } from 'refun'
import { SYMBOL_TABS, SYMBOL_TABS_ITEM, LAYOUT_SIZE_FIT } from '../../symbols'
import { Layout, Layout_Item } from '../layout'
import { mapChildren } from '../../map/children'
import { ThemeContext } from '../theme-context'
import { SizeBorder } from '../size-border'
import { TabsTitle } from './TabsTitle'

export type TTabs = {
  children: ReactNode,
}

export const Tabs = component(
  startWithType<TTabs>(),
  mapContext(ThemeContext),
  mapChildren({
    items: {
      symbols: [SYMBOL_TABS_ITEM],
      isMultiple: true,
      isRequired: true,
    },
  }),
  mapState('activeItemIndex', 'setActiveItemIndex', () => 0, []),
  onChange(({ items, activeItemIndex, setActiveItemIndex }) => {
    if (activeItemIndex >= 0 && items[activeItemIndex].props.isDisabled) {
      setActiveItemIndex(items.findIndex((item) => !item.props.isDisabled))
    }
  }, ['items'])
)(({
  activeItemIndex,
  setActiveItemIndex,
  items,
  theme,
}) => (
  <Layout direction="vertical">
    <Layout_Item height={50}>
      <Layout hPadding={20} spaceBetween={30}>
        <SizeBorder color={theme.tabsBorderColor} bottomWidth={1}/>
        {items.map((item, i) => !item.props.isDisabled && (
          <Layout_Item key={item.props.title} width={LAYOUT_SIZE_FIT} vAlign="center">
            <TabsTitle
              index={i}
              title={item.props.title}
              onPress={setActiveItemIndex}
              isActive={i === activeItemIndex}
              isDisabled={item.props.isDisabled}
            />
          </Layout_Item>
        ))}
      </Layout>
    </Layout_Item>
    {activeItemIndex >= 0 && (
      <Layout_Item>
        {items[activeItemIndex]}
      </Layout_Item>
    )}
  </Layout>
))

Tabs.displayName = 'Tabs'
Tabs.componentSymbol = SYMBOL_TABS
