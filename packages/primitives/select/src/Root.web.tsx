import React from 'react'
import { prefixStyle } from '@lada/prefix'
import { component, mapWithProps, startWithType, mapHandlers } from 'refun'

export type TSelect = {
  id?: string,
  isDisabled?: boolean,
  isHidden?: boolean,
  color?: string,
  family?: string,
  weight?: number,
  size?: number,
  lineHeight?: number,
  letterSpacing?: number,
  paddingBottom?: number,
  paddingLeft?: number,
  paddingRight?: number,
  paddingTop?: number,
  shouldStretch?: boolean,
  value: string,
  onChange: (newValue: string) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
}

export const Select = component(
  startWithType<TSelect>(),
  mapHandlers({
    onChange: ({ onChange }) => (event: any) => onChange(event.target.value),
  }),
  mapWithProps(
    ({
      color,
      isDisabled,
      isHidden,
      letterSpacing,
      lineHeight,
      size,
      family,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      shouldStretch,
      weight,
    }) => ({
      style: prefixStyle({
        // TODO: move to lada
        ...(letterSpacing && {
          letterSpacing: `${letterSpacing}px`,
        }),
        ...(lineHeight && {
          lineHeight: `${lineHeight}px`,
        }),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 'none',
        color,
        fontWeight: weight,
        fontSize: size,
        fontFamily: family,
        fontSmoothing: 'antialiased',
        flexGrow: shouldStretch ? 1 : 0,
        textRendering: 'geometricPrecision',
        textSizeAdjust: 'none',

        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop,

        height: '100%',
        width: '100%',
        // IE 11 + flexbox fix
        maxWidth: '100%',

        cursor: isDisabled ? 'auto' : 'pointer',
        opacity: isHidden ? 0 : 1,
        appearance: 'none',
      }),
    })
  )
)(
  'Select',
  ({
    children,
    id,
    isDisabled,
    style,
    value,
    onChange,
    onFocus,
    onBlur,
    onPressIn,
    onPressOut,
  }) => (
    <select
      id={id}
      disabled={isDisabled}
      style={style}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseDown={onPressIn}
      onMouseUp={onPressOut}
    >
      {children}
    </select>
  )
)
