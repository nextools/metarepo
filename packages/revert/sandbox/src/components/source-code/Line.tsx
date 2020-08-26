import { PrimitiveBlock } from '@revert/block'
import { PrimitiveButton } from '@revert/button'
import { LayoutContext } from '@revert/layout'
import { Size } from '@revert/size'
import { elegir } from 'elegir'
import React from 'react'
import { mapHovered, component, mapHandlers, startWithType, mapWithProps, mapContext, mapPressed, mapKeyboardFocused, onLayout } from 'refun'
import type { TMapHovered, TMapPressed, TMapKeyboardFocused } from 'refun'
import type { TLine as TSyntxLine } from 'syntx'
import { isDefined } from 'tsfn'
import { TRANSPARENT } from '../../colors'
import { selectElement } from '../../store-meta'
import type { TTheme } from '../../types'
import { PrimitiveBackground } from '../background'
import { CollapseIcon } from './CollapseIcon'
import { LineElement } from './LineElement'
import { Text } from './Text'

const LINE_HEIGHT = 20
const LINE_PADDING_LEFT = 70
const LINE_PADDING_RIGHT = 30

export type TLine = {
  index: number,
  line: TSyntxLine,
  lineWidth: number,
  theme: TTheme,
  isCollapsed: boolean,
  isCollapsible: boolean,
  onCollapse: (meta?: any) => void,
  selectedElementPath: string,
} & TMapHovered
  & TMapPressed
  & TMapKeyboardFocused

export const Line = component(
  startWithType<TLine>(),
  mapContext(LayoutContext),
  onLayout(({ _onHeightChange }) => {
    _onHeightChange?.(LINE_HEIGHT)
  }, []),
  mapHovered,
  mapPressed,
  mapKeyboardFocused,
  mapWithProps(({
    line,
    theme,
    isHovered,
    isPressed,
    isKeyboardFocused,
    selectedElementPath,
  }) => {
    const isActive = line.meta === selectedElementPath

    return ({
      backgroundColor: elegir(
        isActive && isPressed,
        theme.sourceCodeActivePressedLineBackgroundColor,
        isPressed,
        theme.sourceCodePressedLineBackgroundColor,
        isActive && isHovered,
        theme.sourceCodeActiveHoveredLineBackgroundColor,
        isHovered,
        theme.sourceCodeHoveredLineBackgroundColor,
        isActive,
        theme.sourceCodeActiveLineBackgroundColor,
        true,
        theme.sourceCodeLineBackgroundColor
      ),
      lineColor: elegir(
        isActive,
        theme.sourceCodeActiveLineColor,
        true,
        theme.sourceCodeLineColor
      ),
      lineFocusedBorderColor: elegir(
        isKeyboardFocused && isActive,
        theme.sourceCodeActiveLineColor,
        isKeyboardFocused,
        theme.sourceCodeLineColor,
        true,
        TRANSPARENT
      ),
    })
  }),
  mapHandlers({
    onPress: ({ line }) => () => {
      if (isDefined(line.meta)) {
        selectElement(line.meta)
      }
    },
    onCollapse: ({ onCollapse, line }) => () => {
      onCollapse(line.meta)
    },
  })
)(({
  _left,
  _top,
  _width,
  _onWidthChange,
  line,
  lineWidth,
  index,
  backgroundColor,
  lineColor,
  lineFocusedBorderColor,
  theme,
  isCollapsible,
  isCollapsed,
  onCollapse,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onPress,
  onFocus,
  onBlur,
}) => (
  <PrimitiveBlock left={_left} top={_top} width={lineWidth + LINE_PADDING_LEFT + LINE_PADDING_RIGHT} height={LINE_HEIGHT}>
    <PrimitiveBackground color={backgroundColor}/>

    <PrimitiveButton
      onPress={onPress}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <Size left={LINE_PADDING_LEFT} width={_width} onWidthChange={_onWidthChange}>
        <PrimitiveBlock shouldFlow>
          {line.elements.map(({ type, value }, i) => (
            <LineElement
              key={i}
              type={type}
              theme={theme}
            >
              {value}
            </LineElement>
          ))}
        </PrimitiveBlock>
      </Size>
    </PrimitiveButton>

    <PrimitiveBlock left={20} shouldIgnorePointerEvents>
      <Text color={lineColor}>
        {String(index + 1).padStart(2, '0')}
      </Text>
      <PrimitiveBlock left={0} right={0} bottom={0} height={2}>
        <PrimitiveBackground color={lineFocusedBorderColor}/>
      </PrimitiveBlock>
    </PrimitiveBlock>
    {isCollapsible && (
      <CollapseIcon
        top={4}
        left={50}
        isCollapsed={isCollapsed}
        onPress={onCollapse}
      />
    )}
  </PrimitiveBlock>
))

Line.displayName = 'Line'
Line.componentSymbol = Symbol('SOURCE_CODE_LINE')