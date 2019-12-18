import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapContext } from 'refun'
import { SizeBackground } from '../size-background'
import { mapStoreState } from '../../store'
import { DemoArea } from '../demo-area'
import { ThemeContext, RootThemeProvider } from '../theme-context'
import { NavigationSidebar } from '../navigation-sidebar'
import { Toolbar, TOOLBAR_HEIGHT } from '../toolbar'
import { Layout, Layout_Item } from '../layout'
import { ControlsSidebar } from '../controls-sidebar'
import { RootContext } from '../root'

const BORDER_SIZE = 1
const CONTROLS_SIDEBAR_MIN_WIDTH = 300
const CONTROLS_SIDEBAR_MAX_WIDTH = 500
const NAVIGATION_SIDEBAR_MIN_WIDTH = 150
const NAVIGATION_SIDEBAR_MAX_WIDTH = 300

export type TSandbox = {
  copyImportPackageName?: string,
}

export const Sandbox = component(
  startWithType<TSandbox>(),
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
  copyImportPackageName,
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
            <SizeBackground color={theme.sandboxBorderColor}/>
          </Layout_Item>

          <Layout_Item height={TOOLBAR_HEIGHT}>
            <Toolbar/>
          </Layout_Item>
        </Layout>
      </Layout_Item>

      {isControlsSidebarVisible && (
        <Fragment>
          <Layout_Item id="controls_border" width={BORDER_SIZE}>
            <SizeBackground color={theme.sandboxBorderColor}/>
          </Layout_Item>
          <Layout_Item id="controls" width={controlsSidebarWidth}>
            <ControlsSidebar
              copyImportPackageName={copyImportPackageName}
            />
          </Layout_Item>
        </Fragment>
      )}
    </Layout>
  </RootThemeProvider>
))

Sandbox.displayName = 'Sandbox'
