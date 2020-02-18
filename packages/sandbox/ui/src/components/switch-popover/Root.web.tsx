import React, { ReactNode, Fragment } from 'react'
import { component, startWithType, mapState, mapHandlers, mapDefaultProps, mapHovered, mapPressed, mapKeyboardFocused, mapWithProps, TMapHovered, TMapKeyboardFocused, mapContext } from 'refun'
import { elegir } from 'elegir'
import { PrimitiveBorder } from '../primitive-border'
import { PrimitiveBackground } from '../primitive-background'
import { Popover } from '../popover'
import { mapChildren, SYMBOL_CHILDREN_REST } from '../../map/children'
import { SYMBOL_SWITCH_POPOVER, SYMBOL_ICON, SYMBOL_TOOLTIP } from '../../symbols'
import { SizeBlock } from '../size-block'
import { TextThemeContext, ButtonIconSwitchThemeContext } from '../theme-context'
import { TRANSPARENT } from '../../colors'
import { Layout, Layout_Item } from '../layout'
import { SizeContent } from '../size-content'
import { SizeCheckbox } from '../size-checkbox'
import { IconDropdownChevronSmall } from '../icons'
import { mapContextOverride } from '../../map/map-context-override'

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
    backgroundColor: elegir(
      isOpened && isPressed,
      activePressedBackgroundColor,
      isPressed,
      pressedBackgroundColor,
      isOpened && isHovered,
      activeHoveredBackgroundColor,
      isHovered,
      hoveredBackgroundColor,
      isOpened,
      activeBackgroundColor,
      true,
      backgroundColor
    ),
    borderColor: elegir(
      isOpened && isKeyboardFocused,
      activeFocusedBorderColor,
      isKeyboardFocused,
      focusedBorderColor,
      true,
      TRANSPARENT
    ),
    color: elegir(
      isOpened && isPressed,
      activePressedIconColor,
      isPressed,
      pressedIconColor,
      isOpened && isHovered,
      activeHoveredIconColor,
      isHovered,
      hoveredIconColor,
      isOpened,
      activeIconColor,
      true,
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
    <SizeBlock width={size + 25} height={size}>
      <PrimitiveBackground
        color={backgroundColor}
        radius={radius}
      />
      <PrimitiveBorder
        color={borderColor}
        radius={borderRadius}
        width={BORDER_WIDTH}
        overflow={BORDER_OVERFLOW}
      />
      {isHovered && tooltip}
      <SizeCheckbox
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
              <SizeContent>
                {icon[0]}
              </SizeContent>
            </Layout_Item>
            <Layout_Item vAlign="center">
              <SizeContent>
                <IconDropdownChevronSmall orientation={isOpened ? 'down' : 'up'}/>
              </SizeContent>
            </Layout_Item>
          </Layout>
        </IconThemeProvider>
      </SizeCheckbox>
    </SizeBlock>
    {isOpened && (
      <Popover onClose={onClose}>
        {content}
      </Popover>
    )}
  </Fragment>
))

SwitchPopover.displayName = 'SwitchPopover'
SwitchPopover.componentSymbol = SYMBOL_SWITCH_POPOVER
