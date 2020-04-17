import React from 'react'
import { component, startWithType, mapWithProps, mapRef, onLayout, mapState } from 'refun'
import { easeInOutCubic } from '@primitives/animation'
import { Animate } from './Animate'
import { TOOLTIP_FONT_SIZE, TOOLTIP_X_OFFSET, TOOLTIP_Y_OFFSET, TOOLTIP_PADDING } from './constants'
import { TTooltip } from './types'

export const Tooltip = component(
  startWithType<TTooltip>(),
  mapState('textSize', 'setTextSize', () => ({ width: 0, height: 0 }), []),
  mapRef('textRef', null as SVGTextElement | null),
  onLayout(({ textRef, setTextSize }) => {
    if (textRef.current !== null) {
      const { width, height } = textRef.current.getBBox()

      setTextSize({
        width,
        height,
      })
    }
  }, ['isActive']),
  mapWithProps(({
    viewportRight,
    viewportTop,
    textSize,
    x,
    y,
  }) => {
    const width = textSize.width + TOOLTIP_PADDING * 2
    const height = textSize.height + TOOLTIP_PADDING * 2
    let posX = x + TOOLTIP_X_OFFSET
    let posY = y - height - TOOLTIP_Y_OFFSET
    let textY = posY + TOOLTIP_PADDING + TOOLTIP_Y_OFFSET + 2
    let spanX = x + TOOLTIP_X_OFFSET + TOOLTIP_PADDING
    const spanY = TOOLTIP_FONT_SIZE + 4

    const offsetX = posX + width - viewportRight
    const offsetY = posY - viewportTop

    if (offsetX > 0) {
      posX -= offsetX + TOOLTIP_X_OFFSET
      spanX -= offsetX + TOOLTIP_X_OFFSET
    }

    if (offsetY < 0) {
      posY += height + TOOLTIP_Y_OFFSET * 2
      textY += height + TOOLTIP_Y_OFFSET * 2
    }

    return {
      tooltip: {
        x: posX,
        y: posY,
        width,
        height,
        textY,
        spanX,
        spanY,
      },
    }
  })
)(({
  isActive,
  version,
  textRef,
  tooltip,
  value,
  valueDifference,
}) => (
  <Animate
    easing={easeInOutCubic}
    time={300}
    to={1}
    from={0}
    isActive={isActive}
  >
    {([opacity]) => (
      <g
        opacity={opacity}
        style={{ pointerEvents: (isActive) ? 'auto' : 'none' }}
      >
        <rect
          x={tooltip.x}
          y={tooltip.y}
          rx="4"
          ry="4"
          width={tooltip.width}
          height={tooltip.height}
          fill="rgba(255, 255, 255, 0.8)"
        />
        <text fontSize={TOOLTIP_FONT_SIZE} fontFamily="monospace" ref={textRef} y={tooltip.textY}>
          <tspan x={tooltip.spanX} dy={0}>
            {version}
          </tspan>
          <tspan x={tooltip.spanX} dy={tooltip.spanY}>
            {value}
            {valueDifference ? (
              <tspan fill={valueDifference > 0 ? 'red' : 'green'}>({valueDifference > 0 ? `+${valueDifference}` : valueDifference}%)
              </tspan>
            ) : null}
          </tspan>
        </text>
      </g>
    )}
  </Animate>
))

Tooltip.displayName = 'Tooltip'
