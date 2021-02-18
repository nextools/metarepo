/* eslint-disable react/no-danger */
import { colorToString } from '@revert/color'
import { Fragment } from 'react'
import type { KeyboardEvent, ChangeEvent, CSSProperties } from 'react'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'
import { isNumber } from 'tsfn'
import { mapUniqueId } from './map-unique-id'
import type { TPrimitiveInput } from './types'

export const PrimitiveInput = component(
  startWithType<TPrimitiveInput>(),
  mapHandlers({
    onChange: ({ onChange }) => (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    onKeyPress: ({ onSubmit }) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSubmit?.()
      }
    },
  }),
  mapWithProps(({
    color = 0xff,
    letterSpacing,
    lineHeight,
    fontFamily,
    fontWeight,
    fontSize,
    paddingBottom,
    paddingLeft,
    paddingRight,
    paddingTop,
    left = 0,
    top = 0,
    width = '100%' as const,
    height = '100%' as const,
  }) => {
    const style: CSSProperties = {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      border: 0,
      fontFamily,
      fontWeight,
      fontSize,
      textRendering: 'geometricPrecision',
      textSizeAdjust: 'none',
      appearance: 'none',
      boxSizing: 'border-box',
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      position: 'absolute',
      left,
      top,
      width,
      height,
      color: colorToString(color),
    }

    if (isNumber(letterSpacing)) {
      style.letterSpacing = `${letterSpacing}px`
    }

    if (isNumber(lineHeight)) {
      style.lineHeight = `${lineHeight}px`
    }

    return {
      style,
    }
  }),
  mapUniqueId()
)(({
  id,
  type,
  uniqueId,
  accessibilityLabel,
  style,
  value,
  isDisabled,
  onChange,
  onKeyPress,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
  onPointerEnter,
  onPointerLeave,
}) => (
  <Fragment>
    <input
      data-unique-id={uniqueId}
      id={id}
      type={type}
      aria-label={accessibilityLabel}
      disabled={isDisabled}
      style={style}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
    />
    {type === 'number' && (
      <style
        dangerouslySetInnerHTML={{
          __html: `input[data-unique-id="${uniqueId}"]::-webkit-outer-spin-button, input[data-unique-id="${uniqueId}"]::-webkit-inner-spin-button { display: none }`,
        }}
      />
    )}
  </Fragment>
))

PrimitiveInput.displayName = 'PrimitiveInput'
