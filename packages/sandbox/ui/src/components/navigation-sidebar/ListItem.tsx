import React from 'react'
import { startWithType, TMapHovered, TMapPressed, mapHovered, mapPressed, mapKeyboardFocused, pureComponent, mapContext, mapWithProps, TMapKeyboardFocused, mapHandlers } from 'refun'
import { elegir } from 'elegir'
import { SizeBackground } from '../size-background'
import { SizeButton } from '../size-button'
import { SizeText } from '../size-text'
import { ThemeContext, TextThemeContext } from '../theme-context'
import { mapContextOverride } from '../../map/map-context-override'

export type TListItem = {
  isActive: boolean,
  children: string,
  onPress: (item: string) => void,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const ListItem = pureComponent(
  startWithType<TListItem>(),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapHandlers({
    onPress: ({ onPress, children }) => () => {
      onPress(children)
    },
  }),
  mapWithProps(({ theme, isActive, isKeyboardFocused, isHovered, isPressed }) => ({
    backgroundColor: elegir(
      isActive,
      theme.navigationSidebarActiveItemBackgroundColor,
      isPressed,
      theme.navigationSidebarPressedItemBackgroundColor,
      isHovered,
      theme.navigationSidebarHoveredItemBackgroundColor,
      isKeyboardFocused,
      theme.navigationSidebarFocusedItemBackgroundColor,
      true,
      theme.navigationSidebarBackgroundColor
    ),
    color: elegir(
      isActive,
      theme.navigationSidebarActiveItemColor,
      isPressed,
      theme.navigationSidebarPressedItemColor,
      isHovered,
      theme.navigationSidebarHoveredItemColor,
      isKeyboardFocused,
      theme.navigationSidebarFocusedItemColor,
      true,
      theme.navigationSidebarItemColor
    ),
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  backgroundColor,
  TextThemeProvider,
  children,
  isKeyboardFocused,
  onFocus,
  onBlur,
  onPress,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <TextThemeProvider>
    <SizeBackground color={backgroundColor}/>
    <SizeButton
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <SizeText isUnderlined={isKeyboardFocused}>
        {children}
      </SizeText>
    </SizeButton>
  </TextThemeProvider>
))

ListItem.displayName = 'ListItem'
ListItem.componentSymbol = Symbol('NAVIGATION_SIDEBAR_LIST_ITEM')
