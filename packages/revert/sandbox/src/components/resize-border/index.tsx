import { LayoutInteractiveContext } from '@revert/layout'
import { elegir } from 'elegir'
import React from 'react'
import { component, mapContext, mapWithProps, startWithType } from 'refun'
import { Background } from '../background'
import { ThemeContext } from '../theme-context'

export const ResizeBorder = component(
  startWithType<{}>(),
  mapContext(LayoutInteractiveContext),
  mapContext(ThemeContext),
  mapWithProps(({
    theme,
    _isHovered,
    _isPressed,
  }) => ({
    color: elegir(
      _isPressed,
      theme.sandboxBorderPressedColor,
      _isHovered,
      theme.sandboxBorderHoveredColor,
      true,
      theme.sandboxBorderColor
    ),
  }))
)(({ color }) => (
  <Background color={color}/>
))
