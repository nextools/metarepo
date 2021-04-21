import { Label } from '@revert/label'
import { Layout, Layout_Item, Layout_Spacer, LayoutContext, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Size } from '@revert/size'
import { TextThemeContext } from '@revert/text'
import { startWithType, mapContext, component } from 'refun'
import { isDefined } from 'tsfn'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { mapStoreState, toggleCanvasDarkMode, toggleNavigationSidebar, toggleControlsSidebar, resetTransform, toggleStretch, toggleGrid, toggleInspect } from '../../store'
import { SYMBOL_TOOLBAR } from '../../symbols'
import { Background } from '../background'
import { ButtonIcon } from '../button-icon'
import { ButtonIconSwitch } from '../button-icon-switch'
import { IconDarkMode, IconInspect, IconPanelCollapseRight, IconStretch, IconGrid, IconScreen, IconCanvas } from '../icons'
import { PluginContext } from '../plugin-provider'
import { Switch } from '../switch'
import { SwitchPopover } from '../switch-popover'
import { Text } from '../text'
import { ThemeContext, ButtonIconThemeContext, ButtonIconSwitchThemeContext } from '../theme-context'
import { Tooltip } from '../tooltip'
import { HeightField } from './HeightField'
import { ResolutionDropdown } from './ResolutionDropdown'
import { WidthField } from './WidthField'
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
    backgroundColor: COLOR_TRANSPARENT,
    hoveredBackgroundColor: COLOR_TRANSPARENT,
    pressedBackgroundColor: COLOR_TRANSPARENT,
    focusedBorderColor: theme.toolbarIconFocusedBorderColor,
    iconColor: theme.toolbarIconColor,
    hoveredIconColor: theme.toolbarIconHoveredColor,
    pressedIconColor: theme.toolbarIconPressedColor,
  })),
  mapContextOverride('ButtonIconSwitchThemeProvider', ButtonIconSwitchThemeContext, ({ theme }) => ({
    backgroundColor: COLOR_TRANSPARENT,
    hoveredBackgroundColor: COLOR_TRANSPARENT,
    pressedBackgroundColor: COLOR_TRANSPARENT,
    activeBackgroundColor: COLOR_TRANSPARENT,
    activeHoveredBackgroundColor: COLOR_TRANSPARENT,
    activePressedBackgroundColor: COLOR_TRANSPARENT,
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
  popoverPlugin,
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
          <Background color={theme.toolbarBackgroundColor}/>
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
                        <Size>
                          <IconCanvas/>
                        </Size>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <Text>
                          Size
                        </Text>
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
                        <Text>
                          Width
                        </Text>
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
                        <Text>
                          Height
                        </Text>
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
                        <Size>
                          <IconDarkMode/>
                        </Size>
                      </Layout_Item>
                      <Layout_Item vAlign="center">
                        <Text>
                          Dark canvas
                        </Text>
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

          {isDefined(popoverPlugin) && (
            <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
              <SwitchPopover>
                <popoverPlugin.Icon/>
                <popoverPlugin.Popover/>
                <Tooltip>
                  {popoverPlugin.tooltipText}
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
