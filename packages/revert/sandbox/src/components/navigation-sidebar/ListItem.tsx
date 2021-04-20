import { Button } from '@revert/button'
import { Fragment } from 'react'
import { startWithType, mapHovered, mapPressed, mapKeyboardFocused, pureComponent, mapContext, mapWithProps, mapHandlers } from 'refun'
import type { TMapKeyboardFocused, TMapHovered, TMapPressed } from 'refun'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'

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
    backgroundColor: (
      isActive ? theme.navigationSidebarActiveItemBackgroundColor :
      isPressed ? theme.navigationSidebarPressedItemBackgroundColor :
      isHovered ? theme.navigationSidebarHoveredItemBackgroundColor :
      isKeyboardFocused ? theme.navigationSidebarFocusedItemBackgroundColor :
      theme.navigationSidebarBackgroundColor
    ),
    color: (
      isActive ? theme.navigationSidebarActiveItemColor :
      isPressed ? theme.navigationSidebarPressedItemColor :
      isHovered ? theme.navigationSidebarHoveredItemColor :
      isKeyboardFocused ? theme.navigationSidebarFocusedItemColor :
      theme.navigationSidebarItemColor
    ),
  }))
)(({
  color,
  backgroundColor,
  isKeyboardFocused,
  children,
  onFocus,
  onBlur,
  onPress,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Fragment>
    <Background color={backgroundColor}/>
    <Button
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Text color={color} isUnderline={isKeyboardFocused}>
        {children}
      </Text>
    </Button>
  </Fragment>
))

ListItem.displayName = 'ListItem'
ListItem.componentSymbol = Symbol('NAVIGATION_SIDEBAR_LIST_ITEM')
