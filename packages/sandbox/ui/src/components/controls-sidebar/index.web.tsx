import React, { Fragment } from 'react'
import { startWithType, pureComponent, mapContext } from 'refun'
import { isString } from 'tsfn'
import { SYMBOL_CONTROLS_SIDEBAR, LAYOUT_SIZE_FIT } from '../../symbols'
import { Layout_Item, Layout } from '../layout'
import { SourceCode } from '../source-code'
import { SizeBackground } from '../size-background'
import { ThemeContext, TextThemeContext, ButtonIconThemeContext } from '../theme-context'
import { Tabs, Tabs_Item } from '../tabs'
import { Console } from '../console'
import { SourceImports } from '../source-imports'
import { mapContextOverride } from '../../map/map-context-override'
import { Header } from './Header'
import { Info } from './Info'
import { CopySourceButton } from './CopySourceButton'
import { CopyImportsButton } from './CopyImportsButton'
import { ClearConsoleButton } from './ClearConsoleButton'
import { Controls } from './Controls'

export type TControlsSidebar = {
  copyImportPackageName?: string,
}

export const ControlsSidebar = pureComponent(
  startWithType<TControlsSidebar>(),
  mapContext(ThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({ color: theme.controlsSidebarColor })),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: theme.controlsSidebarIconBackgroundColor,
    hoveredBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    pressedBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    iconColor: theme.controlsSidebarIconColor,
    hoveredIconColor: theme.controlsSidebarIconColor,
    pressedIconColor: theme.controlsSidebarIconColor,
    focusedBorderColor: theme.controlsSidebarIconBackgroundColor,
  }))
)(({
  copyImportPackageName,
  theme,
  TextThemeProvider,
  ButtonIconThemeProvider,
}) => (
  <ButtonIconThemeProvider>
    <TextThemeProvider>
      <SizeBackground color={theme.controlsSidebarBackgroundColor}/>
      <Layout direction="vertical">
        <Layout_Item height={LAYOUT_SIZE_FIT}>
          <Header/>
        </Layout_Item>
        <Layout_Item>
          <Tabs>
            <Tabs_Item title="Code">
              {() => (
                <Fragment>
                  <SourceCode/>
                  <CopySourceButton/>
                </Fragment>
              )}
            </Tabs_Item>
            {isString(copyImportPackageName) && (
              <Tabs_Item title="Imports">
                {() => (
                  <Fragment>
                    <SourceImports importPackageName={copyImportPackageName}/>
                    <CopyImportsButton importPackageName={copyImportPackageName}/>
                  </Fragment>
                )}
              </Tabs_Item>
            )}
            <Tabs_Item title="Console">
              {() => (
                <Fragment>
                  <Console/>
                  <ClearConsoleButton/>
                </Fragment>
              )}
            </Tabs_Item>
            <Tabs_Item title="About">
              {() => (
                <Info/>
              )}
            </Tabs_Item>
          </Tabs>
        </Layout_Item>

        <Layout_Item height={1}>
          <SizeBackground color={theme.tabsBorderColor}/>
        </Layout_Item>

        <Layout_Item>
          <Controls/>
        </Layout_Item>
      </Layout>
    </TextThemeProvider>
  </ButtonIconThemeProvider>
))

ControlsSidebar.displayName = 'ControlSidebar'
ControlsSidebar.componentSymbol = SYMBOL_CONTROLS_SIDEBAR
