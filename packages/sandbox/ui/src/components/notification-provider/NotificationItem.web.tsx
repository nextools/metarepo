import React from 'react'
import { component, startWithType, mapHandlers, mapSafeTimeout, onMount, mapContext } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { SizeBackground } from '../size-background'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { SizeButton } from '../size-button'
import { SizeText } from '../size-text'
import { ThemeContext, TextThemeContext } from '../theme-context'
import { mapContextOverride } from '../../map/map-context-override'

const TIMEOUT = 5000

export type TNotificationItem = {
  id: string,
  children: string,
  onClose: (id: string) => void,
}

export const NotificationItem = component(
  startWithType<TNotificationItem>(),
  mapContext(ThemeContext),
  mapContextOverride('NotificationTextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.notificationColor,
  })),
  mapContextOverride('CloseTextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.notificationCloseColor,
  })),
  mapHandlers({
    onClose: ({ id, onClose }) => () => {
      onClose(id)
    },
  }),
  mapSafeTimeout('timeout'),
  onMount(({ timeout, onClose }) => {
    timeout(onClose, TIMEOUT)
  })
)(({
  theme,
  NotificationTextThemeProvider,
  CloseTextThemeProvider,
  children,
  onClose,
}) => (
  <Layout hPadding={10} vPadding={10}>
    <SizeBackground color={theme.notificationBackgroundColor}/>
    <Layout_Item vAlign="center">
      <NotificationTextThemeProvider>
        <SizeText>
          {children}
        </SizeText>
      </NotificationTextThemeProvider>
    </Layout_Item>
    <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
      <SizeButton onPress={onClose}>
        <CloseTextThemeProvider>
          <SizeText>
            Close
          </SizeText>
        </CloseTextThemeProvider>
      </SizeButton>
    </Layout_Item>
  </Layout>
))
