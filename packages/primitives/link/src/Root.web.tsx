import React from 'react'
import { normalizeStyle, TStyle } from 'stili'
import { component, startWithType, mapWithProps } from 'refun'
import { isString, isNumber } from 'tsfn'
import { TLink } from './types'

export const Link = component(
  startWithType<TLink>(),
  mapWithProps(({ underlineColor, underlineWidth, children }) => {
    const style: TStyle = ({
      textDecoration: 'none',
      borderWidth: 0,
      borderStyle: 'solid',
    })

    if (isString(underlineColor)) {
      style.borderColor = underlineColor
    }

    let wrappedChildren = children

    if (isNumber(underlineWidth)) {
      const offset = `${4 - underlineWidth}px`

      style.position = 'relative'
      style.bottom = offset
      style.borderBottomWidth = underlineWidth
      wrappedChildren = (
        <span
          style={{
            position: 'relative',
            top: offset,
          }}
        >
          {children}
        </span>
      )
    }

    return {
      style: normalizeStyle(style),
      children: wrappedChildren,
    }
  })
)(
  'Link',
  ({
    id,
    href,
    tabIndex,
    target,
    style,
    children,
    onBlur,
    onFocus,
    onPointerEnter,
    onPointerLeave,
    onPress,
    onPressIn,
    onPressOut,
  }) => (
    <a
      href={href}
      id={id}
      onBlur={onBlur}
      onClick={onPress}
      onFocus={onFocus}
      onMouseDown={onPressIn}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onMouseUp={onPressOut}
      style={style}
      tabIndex={tabIndex}
      target={target}
    >
      {children}
    </a>
  )
)

Link.displayName = 'Link'
