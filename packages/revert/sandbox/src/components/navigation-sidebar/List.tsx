import { Layout, Layout_Item, LayoutContext } from '@revert/layout'
import { startWithType, component, mapContext } from 'refun'
import { mapMetaStoreState, setComponentKey } from '../../store-meta'
import { ThemeContext } from '../theme-context'
import { ListItem } from './ListItem'

const ITEM_HEIGHT = 40

export type TList = {
  items: readonly string[],
}

export const List = component(
  startWithType<TList>(),
  mapContext(LayoutContext),
  mapContext(ThemeContext),
  mapMetaStoreState(({ componentKey }) => ({
    componentKey,
  }), ['componentKey'])
)(({
  _width,
  items,
  componentKey,
}) => (
  <Layout direction="vertical" vPadding={15}>
    {items.map((item) => (
      <Layout_Item key={item} height={ITEM_HEIGHT} vAlign="center" hPadding={_width * 0.1}>
        <ListItem
          isActive={item === componentKey}
          onPress={setComponentKey}
        >
          {item}
        </ListItem>
      </Layout_Item>
    ))}
  </Layout>
))

List.displayName = 'NavigationSidebarList'
List.componentSymbol = Symbol('NAVIGATION_SIDEBAR_LIST')
