import { Layout_Item, Layout, LAYOUT_SIZE_FIT, Layout_Resize } from '@revert/layout'
import { TextThemeContext } from '@revert/text'
import { Fragment } from 'react'
import { startWithType, pureComponent, mapContext } from 'refun'
import { isFunction } from 'tsfn'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_CONTROLS_SIDEBAR } from '../../symbols'
import { Background } from '../background'
import { ComponentControls } from '../component-controls'
import { Console } from '../console'
import { ImportPackageNameContext } from '../import-package-name-provider'
import { ResizeBorder } from '../resize-border'
import { SourceCode } from '../source-code'
import { SourceImports } from '../source-imports'
import { Tabs, Tabs_Item } from '../tabs'
import { ThemeContext, ButtonIconThemeContext } from '../theme-context'
import { ClearConsoleButton } from './ClearConsoleButton'
import { CopyImportsButton } from './CopyImportsButton'
import { CopySourceButton } from './CopySourceButton'
import { Doc } from './Doc'
import { Header } from './Header'
import { Info } from './Info'

export type TControlsSidebar = {}

export const ControlsSidebar = pureComponent(
  startWithType<TControlsSidebar>(),
  mapContext(ThemeContext),
  mapContext(ImportPackageNameContext),
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
  getImportPackageName,
  theme,
  TextThemeProvider,
  ButtonIconThemeProvider,
}) => (
  <ButtonIconThemeProvider>
    <TextThemeProvider>
      <Background color={theme.controlsSidebarBackgroundColor}/>
      <Layout direction="vertical">
        <Layout_Item height={LAYOUT_SIZE_FIT}>
          <Header/>
        </Layout_Item>
        <Layout_Item minHeight={150}>
          <Tabs>
            <Tabs_Item title="Code">
              {() => (
                <Fragment>
                  <SourceCode/>
                  <CopySourceButton/>
                </Fragment>
              )}
            </Tabs_Item>
            {isFunction(getImportPackageName) && (
              <Tabs_Item title="Imports">
                {() => (
                  <Fragment>
                    <SourceImports getImportPackageName={getImportPackageName}/>
                    <CopyImportsButton getImportPackageName={getImportPackageName}/>
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
            <Tabs_Item title="Doc">
              {() => (
                <Doc/>
              )}
            </Tabs_Item>
          </Tabs>
        </Layout_Item>

        <Layout_Resize height={1} overflow={10}>
          <ResizeBorder/>
        </Layout_Resize>

        <Layout_Item minHeight={150}>
          <ComponentControls/>
        </Layout_Item>
      </Layout>
    </TextThemeProvider>
  </ButtonIconThemeProvider>
))

ControlsSidebar.displayName = 'ControlSidebar'
ControlsSidebar.componentSymbol = SYMBOL_CONTROLS_SIDEBAR
