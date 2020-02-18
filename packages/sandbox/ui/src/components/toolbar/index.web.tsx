import React from 'react'
import { startWithType, mapContext, component } from 'refun'
import { isDefined } from 'tsfn'
import { IconDarkMode, IconInspect, IconPanelCollapseRight, IconStretch, IconGrid, IconScreen, IconCanvas } from '../icons'
import { Label } from '../label'
import { ButtonIconSwitch } from '../button-icon-switch'
import { mapStoreState, toggleCanvasDarkMode, toggleNavigationSidebar, toggleControlsSidebar, resetTransform, toggleStretch, toggleGrid, toggleInspect } from '../../store'
import { ThemeContext, ButtonIconThemeContext, ButtonIconSwitchThemeContext, TextThemeContext } from '../theme-context'
import { SwitchPopover } from '../switch-popover'
import { ButtonIcon } from '../button-icon'
import { SizeText } from '../size-text'
import { LayoutContext } from '../layout-context'
import { Layout, Layout_Item, Layout_Spacer } from '../layout'
import { LAYOUT_SIZE_FIT, SYMBOL_TOOLBAR } from '../../symbols'
import { Tooltip } from '../tooltip'
import { SizeBackground } from '../size-background'
import { TRANSPARENT } from '../../colors'
import { SizeContent } from '../size-content'
import { Switch } from '../switch'
import { mapContextOverride } from '../../map/map-context-override'
import { PluginContext } from '../plugin-provider'
import { WidthField } from './WidthField'
import { HeightField } from './HeightField'
import { ResolutionDropdown } from './ResolutionDropdown'
import { ZoomLevel } from './ZoomLevel'

const SCREEN_POPOVER_WIDTH = 380

export const TOOLBAR_HEIGHT = 60

export type TToolbar = {}

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapContext(PluginContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.toolbarTextColor,
  })),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: TRANSPARENT,
    hoveredBackgroundColor: TRANSPARENT,
    pressedBackgroundColor: TRANSPARENT,
    focusedBorderColor: theme.toolbarIconFocusedBorderColor,
    iconColor: theme.toolbarIconColor,
    hoveredIconColor: theme.toolbarIconHoveredColor,
    pressedIconColor: theme.toolbarIconPressedColor,
  })),
  mapContextOverride('ButtonIconSwitchThemeProvider', ButtonIconSwitchThemeContext, ({ theme }) => ({
    backgroundColor: TRANSPARENT,
    hoveredBackgroundColor: TRANSPARENT,
    pressedBackgroundColor: TRANSPARENT,
    activeBackgroundColor: TRANSPARENT,
    activeHoveredBackgroundColor: TRANSPARENT,
    activePressedBackgroundColor: TRANSPARENT,
    focusedBorderColor: theme.toolbarIconFocusedBorderColor,
    activeFocusedBorderColor: theme.toolbarIconActiveFocusedBorderColor,
    iconColor: theme.toolbarIconColor,
    hoveredIconColor: theme.toolbarIconHoveredColor,
    pressedIconColor: theme.toolbarIconPressedColor,
    activeIconColor: theme.toolbarIconActiveColor,
    activeHoveredIconColor: theme.toolbarIconActiveHoveredColor,
    activePressedIconColor: theme.toolbarIconActivePressedColor,
  })),
  mapStoreState(({ isCanvasDarkMode, isNavigationSidebarVisible, isControlsSidebarVisible, transformZ, shouldInspect, shouldStretch, hasGrid }) => ({
    isCanvasDarkMode,
    isNavigationSidebarVisible,
    isControlsSidebarVisible,
    shouldInspect,
    shouldStretch,
    hasGrid,
    zoomLevel: `${Math.floor(transformZ * 100)}%`,
  }), ['isCanvasDarkMode', 'isNavigationSidebarVisible', 'isControlsSidebarVisible', 'transformZ', 'shouldInspect', 'shouldStretch', 'hasGrid'])
)(({
  zoomLevel,
  plugin,
  theme,
  ButtonIconThemeProvider,
  ButtonIconSwitchThemeProvider,
  TextThemeProvider,
  isCanvasDarkMode,
  isNavigationSidebarVisible,
  isControlsSidebarVisible,
  shouldInspect,
  shouldStretch,
  hasGrid,
}) => (
  <ButtonIconSwitchThemeProvider>
    <ButtonIconThemeProvider>
      <TextThemeProvider>
        <Layout hPadding={20} spaceBetween={10}>
          <SizeBackground color={theme.toolbarBackgroundColor}/>
          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ButtonIcon onPress={toggleNavigationSidebar}>
              <IconPanelCollapseRight orientation={isNavigationSidebarVisible ? 'down' : 'up'}/>
              <Tooltip>
                Toggle sidebar
              </Tooltip>
            </ButtonIcon>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <SwitchPopover>
              <IconScreen/>
              <Tooltip>
                Screen options
              </Tooltip>
              <Layout direction="vertical">
                <Layout_Item width={SCREEN_POPOVER_WIDTH} height={40}>
                  <Label>
                    <Layout spaceBetween={15}>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <SizeContent>
                          <IconCanvas/>
                        </SizeContent>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Size
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <ResolutionDropdown/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item width={SCREEN_POPOVER_WIDTH} height={40}>
                  <Label>
                    <Layout>
                      <Layout_Spacer width={45}/>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Width
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={65} vAlign="center">
                        <WidthField/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item width={SCREEN_POPOVER_WIDTH} height={40}>
                  <Label>
                    <Layout>
                      <Layout_Spacer width={45}/>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Height
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={65} vAlign="center">
                        <HeightField/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>

                <Layout_Item width={SCREEN_POPOVER_WIDTH} height={40}>
                  <Label>
                    <Layout spaceBetween={15}>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <SizeContent>
                          <IconDarkMode/>
                        </SizeContent>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <SizeText>
                          Dark canvas
                        </SizeText>
                      </Layout_Item>
                      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
                        <Switch isChecked={isCanvasDarkMode} onToggle={toggleCanvasDarkMode}/>
                      </Layout_Item>
                    </Layout>
                  </Label>
                </Layout_Item>
              </Layout>
            </SwitchPopover>
          </Layout_Item>

          {isDefined(plugin) && (
            <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
              <SwitchPopover>
                <plugin.Icon/>
                <plugin.Popover/>
                <Tooltip>
                  {plugin.tooltip}
                </Tooltip>
              </SwitchPopover>
            </Layout_Item>
          )}

          <Layout_Item hAlign="center">
            <Layout spaceBetween={10}>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={shouldStretch} onToggle={toggleStretch}>
                  <IconStretch/>
                  <Tooltip>
                    Stretch component
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={hasGrid} onToggle={toggleGrid}>
                  <IconGrid/>
                  <Tooltip>
                    Toggle grid
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
              <Layout_Item vAlign="center">
                <ButtonIconSwitch isChecked={shouldInspect} onToggle={toggleInspect}>
                  <IconInspect/>
                  <Tooltip>
                    Inspect component
                  </Tooltip>
                </ButtonIconSwitch>
              </Layout_Item>
            </Layout>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ZoomLevel onPress={resetTransform}>
              {zoomLevel}
            </ZoomLevel>
          </Layout_Item>

          <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
            <ButtonIcon onPress={toggleControlsSidebar}>
              <IconPanelCollapseRight orientation={isControlsSidebarVisible ? 'up' : 'down'}/>
              <Tooltip arrowPosition="bottom-right">
                Toggle sidebar
              </Tooltip>
            </ButtonIcon>
          </Layout_Item>
        </Layout>
      </TextThemeProvider>
    </ButtonIconThemeProvider>
  </ButtonIconSwitchThemeProvider>
))

Toolbar.displayName = 'Toolbar'
Toolbar.componentSymbol = SYMBOL_TOOLBAR
