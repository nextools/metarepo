import { AnimationValue } from '@revert/animation'
import { PrimitiveBlock } from '@revert/block'
import { PrimitiveButton } from '@revert/button'
import { LayoutContext, LayoutPortalContext } from '@revert/layout'
import { RootContext } from '@revert/root'
import { TextThemeContext } from '@revert/text'
import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { component, startWithType, mapContext, mapState, mapWithProps, mapDefaultProps } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { PrimitiveBackground } from '../background'
import { IconTooltipArrowDown } from '../icons'
import { PopoverThemeContext } from '../theme-context'

const POPOVER_ANIMATION_TIME = 200
const POPOVER_H_PADDING = 20
const POPOVER_V_PADDING = 10
const ARROW_H_OFFSET = 20
const ARROW_V_OFFSET = 10
const ARROW_HALF_WIDTH = 10
const POPOVER_V_OFFSET = 10

export type TPopover = {
  hPadding?: number,
  vPadding?: number,
  arrowPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  children: ReactNode,
  onClose?: () => void,
}

export const Popover = component(
  startWithType<TPopover>(),
  mapContext(LayoutPortalContext),
  mapContext(LayoutContext),
  mapContext(RootContext),
  mapContext(PopoverThemeContext),
  mapDefaultProps({
    arrowPosition: 'bottom-left',
    hPadding: POPOVER_H_PADDING,
    vPadding: POPOVER_V_PADDING,
  }),
  mapContextOverride('ArrowIconThemeProvider', TextThemeContext, ({ backgroundColor }) => ({
    color: backgroundColor,
  })),
  mapState('contentWidth', 'setContentWidth', () => 0, []),
  mapState('contentHeight', 'setContentHeight', () => 0, []),
  mapWithProps(({ _x, _y, _width, _height, contentWidth, contentHeight, hPadding, vPadding, arrowPosition }) => {
    const height = contentHeight + vPadding * 2
    const width = contentWidth + hPadding * 2
    const centerX = _x + _width / 2

    switch (arrowPosition) {
      case 'top-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + POPOVER_V_OFFSET,
          width,
          height,
        }
      }
      case 'top-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: -ARROW_V_OFFSET,
          x: centerX - ARROW_H_OFFSET,
          y: _y + _height + ARROW_V_OFFSET + POPOVER_V_OFFSET,
          width,
          height,
        }
      }
      case 'bottom-right': {
        return {
          arrowLeft: width - ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - width + ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - POPOVER_V_OFFSET,
          width,
          height,
        }
      }
      case 'bottom-left': {
        return {
          arrowLeft: ARROW_H_OFFSET - ARROW_HALF_WIDTH,
          arrowTop: height - ARROW_HALF_WIDTH,
          x: centerX - ARROW_H_OFFSET,
          y: _y - height - ARROW_V_OFFSET - POPOVER_V_OFFSET,
          width,
          height,
        }
      }
    }
  })
)(({
  x,
  y,
  _rootWidth,
  _rootHeight,
  width,
  height,
  contentWidth,
  contentHeight,
  setContentWidth,
  setContentHeight,
  arrowLeft,
  arrowTop,
  arrowPosition,
  hPadding,
  vPadding,
  portalElement,
  children,
  backgroundColor,
  ArrowIconThemeProvider,
  onClose,
}) => {
  if (portalElement === null) {
    return null
  }

  return createPortal(
    (
      <Fragment>
        <PrimitiveBlock
          left={0}
          top={0}
          width={_rootWidth}
          height={_rootHeight}
        >
          <PrimitiveButton onPress={onClose}/>
        </PrimitiveBlock>
        <AnimationValue fromValue={0} toValue={1} time={POPOVER_ANIMATION_TIME}>
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
                  _x: x + hPadding,
                  _y: y + vPadding,
                  _parentLeft: 0,
                  _parentTop: 0,
                  _parentWidth: width,
                  _parentHeight: height,
                  _left: hPadding,
                  _top: vPadding,
                  _width: contentWidth,
                  _height: contentHeight,
                  _onWidthChange: setContentWidth,
                  _onHeightChange: setContentHeight,
                }}
              >
                {children}
              </LayoutContext.Provider>
            </PrimitiveBlock>
          )}
        </AnimationValue>
      </Fragment>
    ),
    portalElement
  )
})

Popover.displayName = 'Popover'
