import { Block } from '@revert/block'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { startWithType, mapContext, mapHandlers, pureComponent } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { mapMetaStoreState } from '../../store-meta'
import { getComponentName, globalObject } from '../../utils'
import { ButtonIcon } from '../button-icon'
import { IconCopyUrl } from '../icons'
import { NotificationContext } from '../notification-provider'
import { Text } from '../text'
import { ThemeContext, ButtonIconThemeContext } from '../theme-context'
import { Tooltip } from '../tooltip'

const HEIGHT = 70

export type THeader = {}

export const Header = pureComponent(
  startWithType<THeader>(),
  mapContext(ThemeContext),
  mapContext(NotificationContext),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: theme.controlsSidebarIconBackgroundColor,
    hoveredBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    pressedBackgroundColor: theme.controlsSidebarIconBackgroundColor,
    iconColor: theme.controlsSidebarIconColor,
    hoveredIconColor: theme.controlsSidebarIconColor,
    pressedIconColor: theme.controlsSidebarIconColor,
    focusedBorderColor: theme.controlsSidebarIconBackgroundColor,
  })),
  mapMetaStoreState(({ Component }) => ({
    componentName: Component !== null ? getComponentName(Component) : '',
  }), ['Component']),
  mapHandlers({
    onCopyUrl: ({ sendNotification }) => async () => {
      await navigator.clipboard.writeText(globalObject.location.href)
      sendNotification('Copied Url')
    },
  })
)(({
  componentName,
  ButtonIconThemeProvider,
  onCopyUrl,
}) => (
  <Block height={HEIGHT}>
    <ButtonIconThemeProvider>
      <Layout hPadding={20} spaceBetween={10}>
        <Layout_Item vAlign="center">
          <Text>
            {componentName}
          </Text>
        </Layout_Item>

        <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
          <ButtonIcon size={40} onPress={onCopyUrl}>
            <IconCopyUrl/>
            <Tooltip arrowPosition="top-right">
              Copy Url
            </Tooltip>
          </ButtonIcon>
        </Layout_Item>
      </Layout>
    </ButtonIconThemeProvider>
  </Block>
))

Header.displayName = 'Header'
Header.componentSymbol = Symbol('CONTROLS_SIDEBAR_SYMBOL')
