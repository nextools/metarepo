import { Block } from '@revert/block'
import { Checkbox } from '@revert/checkbox'
import { Layout, Layout_Item } from '@revert/layout'
import { Size } from '@revert/size'
import { TextThemeContext } from '@revert/text'
import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { component, startWithType, mapState, mapHandlers, mapDefaultProps, mapHovered, mapPressed, mapKeyboardFocused, mapWithProps, mapContext } from 'refun'
import type { TMapHovered, TMapKeyboardFocused } from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapChildren, SYMBOL_CHILDREN_REST } from '../../map/children'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_SWITCH_POPOVER, SYMBOL_ICON, SYMBOL_TOOLTIP } from '../../symbols'
import { PrimitiveBackground } from '../background'
import { PrimitiveBorder } from '../border'
import { IconDropdownChevronSmall } from '../icons'
import { Popover } from '../popover'
import { ButtonIconSwitchThemeContext } from '../theme-context'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4

export type TSwitchPopover = {
  size?: number,
  accessibilityLabel?: string,
  children: ReactNode,
} & TMapHovered
  & TMapKeyboardFocused

export const SwitchPopover = component(
  startWithType<TSwitchPopover>(),
  mapContext(ButtonIconSwitchThemeContext),
  mapDefaultProps({
    accessibilityLabel: '',
    size: 26,
  }),
  mapState('isOpened', 'setIsOpened', () => false, []),
  mapHandlers({
    onToggle: ({ isOpened, setIsOpened }) => () => {
      setIsOpened(!isOpened)
    },
    onClose: ({ setIsOpened }) => () => {
      setIsOpened(false)
    },
  }),
  mapChildren({
    icon: {
      symbols: [SYMBOL_ICON],
      isRequired: true,
    },
    tooltip: {
      symbols: [SYMBOL_TOOLTIP],
    },
    content: {
      symbols: [SYMBOL_CHILDREN_REST],
    },
  }),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    size,
    isOpened,
    isKeyboardFocused,
    isPressed,
    isHovered,
    focusedBorderColor,
    activeFocusedBorderColor,
    iconColor,
    activeHoveredIconColor,
    activeIconColor,
    activePressedIconColor,
    hoveredIconColor,
    pressedIconColor,
    backgroundColor,
    activeBackgroundColor,
    activeHoveredBackgroundColor,
    activePressedBackgroundColor,
    hoveredBackgroundColor,
    pressedBackgroundColor,
  }) => ({
    backgroundColor: (
      isOpened && isPressed ? activePressedBackgroundColor :
      isPressed ? pressedBackgroundColor :
      isOpened && isHovered ? activeHoveredBackgroundColor :
      isHovered ? hoveredBackgroundColor :
      isOpened ? activeBackgroundColor :
      backgroundColor
    ),
    borderColor: (
      isOpened && isKeyboardFocused ? activeFocusedBorderColor :
      isKeyboardFocused ? focusedBorderColor :
      COLOR_TRANSPARENT
    ),
    color: (
      isOpened && isPressed ? activePressedIconColor :
      isPressed ? pressedIconColor :
      isOpened && isHovered ? activeHoveredIconColor :
      isHovered ? hoveredIconColor :
      isOpened ? activeIconColor :
      iconColor
    ),
    radius: size / 2,
    borderRadius: (size / 2) + BORDER_OVERFLOW,
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ color }) => ({ color }))
)(({
  accessibilityLabel,
  size,
  radius,
  backgroundColor,
  borderColor,
  borderRadius,
  isOpened,
  isHovered,
  icon,
  tooltip,
  content,
  IconThemeProvider,
  onToggle,
  onClose,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
}) => (
  <Fragment>
    <Block width={size + 25} height={size}>
      <PrimitiveBackground
        color={backgroundColor}
        radius={radius}
      />
      <PrimitiveBorder
        color={borderColor}
        radius={borderRadius}
        borderWidth={BORDER_WIDTH}
        overflow={BORDER_OVERFLOW}
      />
      {isHovered && tooltip}
      <Checkbox
        isChecked={isOpened}
        accessibilityLabel={accessibilityLabel}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onToggle={onToggle}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <IconThemeProvider>
          <Layout hPadding={5} spaceBetween={10}>
            <Layout_Item vAlign="center">
              <Size>
                {icon[0]}
              </Size>
            </Layout_Item>
            <Layout_Item vAlign="center">
              <Size>
                <IconDropdownChevronSmall orientation={isOpened ? 'down' : 'up'}/>
              </Size>
            </Layout_Item>
          </Layout>
        </IconThemeProvider>
      </Checkbox>
    </Block>
    {isOpened && (
      <Popover onClose={onClose}>
        {content}
      </Popover>
    )}
  </Fragment>
))

SwitchPopover.displayName = 'SwitchPopover'
SwitchPopover.componentSymbol = SYMBOL_SWITCH_POPOVER
