import { Button } from '@revert/button'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { component, startWithType, mapHandlers, mapSafeTimeout, mapContext, onUpdate } from 'refun'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'

const TIMEOUT = 5000

export type TNotificationItem = {
  id: string,
  children: string,
  onClose: (id: string) => void,
}

export const NotificationItem = component(
  startWithType<TNotificationItem>(),
  mapContext(ThemeContext),
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
  children,
  onClose,
}) => (
  <Layout hPadding={10} vPadding={10}>
    <Background color={theme.notificationBackgroundColor}/>
    <Layout_Item vAlign="center">
      <Text color={theme.notificationColor}>
        {children}
      </Text>
    </Layout_Item>
    <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
      <Button onPress={onClose}>
        <Text color={theme.notificationCloseColor}>
          Close
        </Text>
      </Button>
    </Layout_Item>
  </Layout>
))
