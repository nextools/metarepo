import React from 'react'
import { component, startWithType, mapHandlers, mapContext, mapWithProps, TMapKeyboardFocused, mapKeyboardFocused } from 'refun'
import { elegir } from 'elegir'
import { ThemeContext, TextThemeContext } from '../theme-context'
import { SizeBorder } from '../size-border'
import { SizeButton } from '../size-button'
import { SizeText } from '../size-text'
import { TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'

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
    <SizeBorder color={borderColor} bottomWidth={2}/>
    <SizeButton
      isDisabled={isDisabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <SizeText>
        {title}
      </SizeText>
    </SizeButton>
  </TextThemeProvider>
))
