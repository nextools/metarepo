import React from 'react'
import { startWithType, mapContext, mapHandlers, pureComponent } from 'refun'
import { isUndefined } from 'tsfn'
import { ThemeContext, ButtonIconThemeContext } from '../theme-context'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { getComponentName, globalObject } from '../../utils'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { ButtonIcon } from '../button-icon'
import { IconCopyUrl } from '../icons'
import { Tooltip } from '../tooltip'
import { NotificationContext } from '../notification-provider'
import { SizeBlock } from '../size-block'
import { mapContextOverride } from '../../map/map-context-override'
import { mapMetaStoreState } from '../../store-meta'

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
    componentName: isUndefined(Component) ? '' : getComponentName(Component),
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
  <SizeBlock height={HEIGHT}>
    <ButtonIconThemeProvider>
      <Layout hPadding={20} spaceBetween={10}>
        <Layout_Item vAlign="center">
          <SizeText>
            {componentName}
          </SizeText>
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
  </SizeBlock>
))

Header.displayName = 'Header'
Header.componentSymbol = Symbol('CONTROLS_SIDEBAR_SYMBOL')
