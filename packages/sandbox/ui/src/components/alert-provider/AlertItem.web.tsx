import React from 'react'
import { component, startWithType, mapHandlers, mapContext } from 'refun'
import { Layout, Layout_Item } from '../layout'
import { SizeBackground } from '../size-background'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { SizeButton } from '../size-button'
import { SizeText } from '../size-text'
import { ThemeContext, TextThemeContext } from '../theme-context'
import { mapContextOverride } from '../../map/map-context-override'

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
      <SizeBackground color={theme.alertBackgroundColor}/>
      <Layout_Item vAlign="center">
        <SizeText>
          {children}
        </SizeText>
      </Layout_Item>
      <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
        <SizeButton onPress={onClose}>
          <SizeText>
            Dismiss
          </SizeText>
        </SizeButton>
      </Layout_Item>
    </Layout>
  </TextThemeProvider>
))
