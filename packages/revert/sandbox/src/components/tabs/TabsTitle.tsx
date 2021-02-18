import { Button } from '@revert/button'
import { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapContext, mapWithProps, mapKeyboardFocused } from 'refun'
import type { TMapKeyboardFocused } from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { Border } from '../border'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'

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
    color: (
      isDisabled ? theme.tabsDisabledColor :
      isActive ? theme.tabsActiveColor :
      theme.tabsColor
    ),
    borderColor: (
      isActive ? theme.tabsActiveBorderColor :
      isKeyboardFocused ? theme.tabsBorderColor :
      COLOR_TRANSPARENT
    ),
  })),
  mapHandlers({
    onPress: ({ index, onPress }) => () => {
      onPress(index)
    },
  })
)(({
  title,
  color,
  borderColor,
  isDisabled,
  onPress,
  onPressIn,
  onPressOut,
  onFocus,
  onBlur,
}) => (
  <Fragment>
    <Border color={borderColor} borderBottomWidth={2}/>
    <Button
      isDisabled={isDisabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Text color={color}>
        {title}
      </Text>
    </Button>
  </Fragment>
))
