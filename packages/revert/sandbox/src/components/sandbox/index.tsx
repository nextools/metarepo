import { Background } from '@revert/background'
import { Layout, Layout_Item } from '@revert/layout'
import { RootContext } from '@revert/root'
import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapContext } from 'refun'
import { mapStoreState } from '../../store'
import { ControlsSidebar } from '../controls-sidebar'
import { DemoArea } from '../demo-area'
import { NavigationSidebar } from '../navigation-sidebar'
import { ThemeContext, RootThemeProvider } from '../theme-context'
import { Toolbar, TOOLBAR_HEIGHT } from '../toolbar'

const BORDER_SIZE = 1
const CONTROLS_SIDEBAR_MIN_WIDTH = 300
const CONTROLS_SIDEBAR_MAX_WIDTH = 500
const NAVIGATION_SIDEBAR_MIN_WIDTH = 150
const NAVIGATION_SIDEBAR_MAX_WIDTH = 300

export const Sandbox = component(
  startWithType<{}>(),
  mapContext(ThemeContext),
  mapContext(RootContext),
  mapStoreState(({ isNavigationSidebarVisible, isControlsSidebarVisible }) => ({
    isNavigationSidebarVisible,
    isControlsSidebarVisible,
  }), ['isNavigationSidebarVisible', 'isControlsSidebarVisible']),
  mapWithProps(({ _rootWidth }) => ({
    navigationSidebarWidth: Math.min(Math.max(_rootWidth * 0.2, NAVIGATION_SIDEBAR_MIN_WIDTH), NAVIGATION_SIDEBAR_MAX_WIDTH),
    controlsSidebarWidth: Math.min(Math.max(_rootWidth * 0.3, CONTROLS_SIDEBAR_MIN_WIDTH), CONTROLS_SIDEBAR_MAX_WIDTH),
  }))
)(({
  theme,
  navigationSidebarWidth,
  controlsSidebarWidth,
  isNavigationSidebarVisible,
  isControlsSidebarVisible,
}) => (
  <RootThemeProvider>
    <Layout>
      {isNavigationSidebarVisible && (
        <Layout_Item id="navigation" width={navigationSidebarWidth}>
          <NavigationSidebar/>
        </Layout_Item>
      )}

      <Layout_Item id="demo_area">
        <Layout direction="vertical">
          <Layout_Item>
            <DemoArea/>
          </Layout_Item>

          <Layout_Item height={BORDER_SIZE}>
            <Background color={theme.sandboxBorderColor}/>
          </Layout_Item>

          <Layout_Item height={TOOLBAR_HEIGHT}>
            <Toolbar/>
          </Layout_Item>
        </Layout>
      </Layout_Item>

      {isControlsSidebarVisible && (
        <Fragment>
          <Layout_Item id="controls_border" width={BORDER_SIZE}>
            <Background color={theme.sandboxBorderColor}/>
          </Layout_Item>
          <Layout_Item id="controls" width={controlsSidebarWidth}>
            <ControlsSidebar/>
          </Layout_Item>
        </Fragment>
      )}
    </Layout>
  </RootThemeProvider>
))

Sandbox.displayName = 'Sandbox'
