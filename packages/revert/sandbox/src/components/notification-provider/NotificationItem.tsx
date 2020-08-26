import { Button } from '@revert/button'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import React from 'react'
import { component, startWithType, mapHandlers, mapSafeTimeout, mapContext, onUpdate } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext, TextThemeContext } from '../theme-context'

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
  onUpdate(({ timeout, onClose }) => {
    timeout(onClose, TIMEOUT)
  }, [])
)(({
  theme,
  NotificationTextThemeProvider,
  CloseTextThemeProvider,
  children,
  onClose,
}) => (
  <Layout hPadding={10} vPadding={10}>
    <Background color={theme.notificationBackgroundColor}/>
    <Layout_Item vAlign="center">
      <NotificationTextThemeProvider>
        <Text>
          {children}
        </Text>
      </NotificationTextThemeProvider>
    </Layout_Item>
    <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
      <Button onPress={onClose}>
        <CloseTextThemeProvider>
          <Text>
            Close
          </Text>
        </CloseTextThemeProvider>
      </Button>
    </Layout_Item>
  </Layout>
))
