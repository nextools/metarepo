import { Button } from '@revert/button'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { TextThemeContext } from '@revert/text'
import { component, startWithType, mapHandlers, mapContext } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'

export type TAlertItem = {
  id: string,
  children: string,
  onClose: (id: string) => void,
}

export const AlertItem = component(
  startWithType<TAlertItem>(),
  mapContext(ThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.alertColor,
  })),
  mapHandlers({
    onClose: ({ id, onClose }) => () => {
      onClose(id)
    },
  })
)(({
  theme,
  TextThemeProvider,
  children,
  onClose,
}) => (
  <TextThemeProvider>
    <Layout hPadding={10} vPadding={10}>
      <Background color={theme.alertBackgroundColor}/>
      <Layout_Item vAlign="center">
        <Text>
          {children}
        </Text>
      </Layout_Item>
      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
        <Button onPress={onClose}>
          <Text>
            Dismiss
          </Text>
        </Button>
      </Layout_Item>
    </Layout>
  </TextThemeProvider>
))

AlertItem.displayName = 'AlertItem'
