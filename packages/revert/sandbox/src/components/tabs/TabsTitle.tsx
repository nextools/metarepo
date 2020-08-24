import { Border } from '@revert/border'
import { Button } from '@revert/button'
import { elegir } from 'elegir'
import React from 'react'
import { component, startWithType, mapHandlers, mapContext, mapWithProps, mapKeyboardFocused } from 'refun'
import type { TMapKeyboardFocused } from 'refun'
import { TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { Text } from '../text'
import { ThemeContext, TextThemeContext } from '../theme-context'

export type TTabsTitle = {
  index: number,
  title: string,
  isDisabled: boolean,
  isActive: boolean,
  onPress: (index: number) => void,
} & TMapKeyboardFocused

export const TabsTitle = component(
  startWithType<TTabsTitle>(),
  mapContext(ThemeContext),
  mapKeyboardFocused,
  mapWithProps(({ isActive, isDisabled, isKeyboardFocused, theme }) => ({
    color: elegir(
      isDisabled,
      theme.tabsDisabledColor,
      isActive,
      theme.tabsActiveColor,
      true,
      theme.tabsColor
    ),
    borderColor: elegir(
      isActive,
      theme.tabsActiveBorderColor,
      isKeyboardFocused,
      theme.tabsBorderColor,
      true,
      TRANSPARENT
    ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color })),
  mapHandlers({
    onPress: ({ index, onPress }) => () => {
      onPress(index)
    },
  })
)(({
  title,
  TextThemeProvider,
  borderColor,
  isDisabled,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <TextThemeProvider>
    <Border color={borderColor} borderBottomWidth={2}/>
    <Button
      isDisabled={isDisabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Text>
        {title}
      </Text>
    </Button>
  </TextThemeProvider>
))
