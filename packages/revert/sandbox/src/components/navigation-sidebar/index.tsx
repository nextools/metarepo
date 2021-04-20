import { Layout, Layout_Item, LayoutContext, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Scroll } from '@revert/scroll'
import leven from 'leven'
import { startWithType, mapState, mapHandlers, mapContext, pureComponent } from 'refun'
import { mapMetaStoreState } from '../../store-meta'
import { SYMBOL_NAVIGATION_SIDEBAR } from '../../symbols'
import { Background } from '../background'
import { ThemeContext } from '../theme-context'
import { List } from './List'
import { SearchField } from './SearchField'

export type TNavigationSidebar = {}

export const NavigationSidebar = pureComponent(
  startWithType<TNavigationSidebar>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapMetaStoreState(({ components: components }) => ({
    components,
  }), ['components']),
  mapState(
    'filteredComponentNames',
    'setFilteredComponentNames',
    ({ components }) => (components !== null ? Object.keys(components) : []),
    ['components']
  ),
  mapHandlers({
    onChange: ({ setFilteredComponentNames, components }) => (value: string) => {
      if (components === null) {
        return
      }

      const b = value.toLocaleLowerCase()

      setFilteredComponentNames(
        Object.keys(components).filter((name) => {
          const a = name.toLocaleLowerCase()

          if (a.startsWith(b)) {
            return true
          }

          if (b.length >= 3 && a.includes(b)) {
            return true
          }

          if (Math.abs(a.length - b.length) <= 2 && leven(name, value) <= 2) {
            return true
          }
        })
      )
    },
  })
)(({ _width, filteredComponentNames, theme, onChange }) => (
  <Layout direction="vertical">
    <Background color={theme.navigationSidebarBackgroundColor}/>
    <Layout_Item height={LAYOUT_SIZE_FIT} vPadding={20} hPadding={_width * 0.1}>
      <SearchField onChange={onChange}/>
    </Layout_Item>
    <Layout_Item>
      <Scroll shouldScrollVertically>
        <List items={filteredComponentNames}/>
      </Scroll>
    </Layout_Item>
  </Layout>
))

NavigationSidebar.displayName = 'NavigationSidebar'
NavigationSidebar.componentSymbol = SYMBOL_NAVIGATION_SIDEBAR
