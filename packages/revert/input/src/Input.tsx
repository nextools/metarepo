import { LayoutContext } from '@revert/layout'
import React from 'react'
import { component, startWithType, mapContext } from 'refun'
import { PrimitiveInput } from './PrimitiveInput'
import type { TInput } from './types'

export const Input = component(
  startWithType<TInput>(),
  mapContext(LayoutContext)
)(({
  _parentLeft,
  _parentTop,
  _parentWidth,
  _parentHeight,
  value,
  onChange,
  accessibilityLabel,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  id,
  isDisabled,
  letterSpacing,
  lineHeight,
  onBlur,
  onFocus,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onSubmit,
  paddingBottom,
  paddingTop,
  paddingLeft,
  paddingRight,
}) => (
  <PrimitiveInput
    left={_parentLeft}
    top={_parentTop}
    width={_parentWidth}
    height={_parentHeight}
    value={value}
    onChange={onChange}
    accessibilityLabel={accessibilityLabel}
    color={color}
    fontFamily={fontFamily}
    fontSize={fontSize}
    fontWeight={fontWeight}
    id={id}
    isDisabled={isDisabled}
    letterSpacing={letterSpacing}
    lineHeight={lineHeight}
    onBlur={onBlur}
    onFocus={onFocus}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    onPressIn={onPressIn}
    onPressOut={onPressOut}
    onSubmit={onSubmit}
    paddingBottom={paddingBottom}
    paddingTop={paddingTop}
    paddingLeft={paddingLeft}
    paddingRight={paddingRight}
  />
))

Input.displayName = 'Input'
Input.componentSymbol = Symbol('REVERT_INPUT')
