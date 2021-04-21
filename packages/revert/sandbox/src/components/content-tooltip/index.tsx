import { AnimationValue } from '@revert/animation'
import { PrimitiveBlock } from '@revert/block'
import { LayoutContext, LayoutPortalContext } from '@revert/layout'
import { TextThemeContext } from '@revert/text'
import type { ReactElement } from 'react'
import { createPortal } from 'react-dom'
import { component, startWithType, mapContext, mapState, mapWithProps, mapDefaultProps, mapSafeTimeout, onUpdate } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_TOOLTIP } from '../../symbols'
import { PrimitiveBackground } from '../background'
import { IconTooltipArrowDown } from '../icons'
import { TooltipThemeContext } from '../theme-context'

const TOOLTIP_ANIMATION_TIME = 200
const TOOLTIP_TIMEOUT = 300
const TOOLTIP_H_PADDING = 15
const TOOLTIP_V_PADDING = 10
const ARROW_H_OFFSET = 20
const ARROW_V_OFFSET = 10
const ARROW_HALF_WIDTH = 10
const TOOLTIP_V_OFFSET = 10

export type TContentTooltip = {
  maxWidth?: number,
  arrowPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  children: ReactElement,
}

export const ContentTooltip = component(
  startWithType<TContentTooltip>(),
  mapDefaultProps({
    arrowPosition: 'bottom-left',
  }),
  mapContext(TooltipThemeContext),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ color }) => ({ color })),
  mapContextOverride('ArrowIconThemeProvider', TextThemeContext, ({ backgroundColor }) => ({ color: backgroundColor })),
  mapContext(LayoutPortalContext),
  mapContext(LayoutContext),
  mapState('isOpen', 'setIsOpen', () => false, []),
  mapSafeTimeout('setSafeTimeout'),
  onUpdate(({ setSafeTimeout, setIsOpen }) => {
    setSafeTimeout(() => {
      setIsOpen(true)
    }, TOOLTIP_TIMEOUT)
  }, []),
  mapState('contentWidth', 'setContentWidth', () => 0, []),
  mapState('contentHeight', 'setContentHeight', () => 0, []),
  mapWithProps(({ _x, _y, arrowPosition, _width, _height, contentWidth, contentHeight }) => {
    const width = contentWidth + TOOLTIP_H_PADDING * 2
    const height = contentHeight + TOOLTIP_V_PADDING * 2
    const centerX = _x + _width / 2

    switch (arrowPosition) {
      case 'top-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + TOOLTIP_V_OFFSET,
          width,
          height,
        }
      }
      case 'top-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + TOOLTIP_V_OFFSET,
          width,
          height,
        }
      }
      case 'bottom-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - TOOLTIP_V_OFFSET,
          width,
          height,
        }
      }
      case 'bottom-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - TOOLTIP_V_OFFSET,
          width,
          height,
        }
      }
    }
  })
)(({
  arrowLeft,
  arrowTop,
  x,
  y,
  width,
  height,
  contentWidth,
  contentHeight,
  setContentWidth,
  setContentHeight,
  arrowPosition,
  portalElement,
  maxWidth,
  backgroundColor,
  TextThemeProvider,
  ArrowIconThemeProvider,
  children,
  isOpen,
}) => {
  if (portalElement === null) {
    return null
  }

  return createPortal(
    <AnimationValue toValue={isOpen ? 1 : 0} time={TOOLTIP_ANIMATION_TIME}>
      {(opacity) => (
        <PrimitiveBlock
          left={x}
          top={y}
          width={width}
          height={height}
          opacity={opacity}
        >
          <PrimitiveBackground color={backgroundColor}/>
          <PrimitiveBlock left={arrowLeft} top={arrowTop}>
            <ArrowIconThemeProvider>
              <IconTooltipArrowDown orientation={(arrowPosition === 'top-right' || arrowPosition === 'top-left') ? 'down' : 'up'}/>
            </ArrowIconThemeProvider>
          </PrimitiveBlock>
          <LayoutContext.Provider
            value={{
              _x: x + TOOLTIP_H_PADDING,
              _y: y + TOOLTIP_V_PADDING,
              _parentLeft: 0,
              _parentTop: 0,
              _parentWidth: width,
              _parentHeight: height,
              _left: TOOLTIP_H_PADDING,
              _top: TOOLTIP_V_PADDING,
              _width: contentWidth,
              _height: contentHeight,
              _maxWidth: maxWidth,
              _onWidthChange: setContentWidth,
              _onHeightChange: setContentHeight,
            }}
          >
            <TextThemeProvider>
              {children}
            </TextThemeProvider>
          </LayoutContext.Provider>
        </PrimitiveBlock>
      )}
    </AnimationValue>,
    portalElement
  )
})

ContentTooltip.displayName = 'ContentTooltip'
ContentTooltip.componentSymbol = SYMBOL_TOOLTIP
