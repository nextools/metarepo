import { PrimitiveBlock } from '@revert/block'
import { Surface, Group, Shape } from '@revert/svg'
import { startWithType, mapWithProps, pureComponent, mapWithPropsMemo } from 'refun'
import * as Colors from './colors'
import type { TCanvasGrid } from './types'

const CANVAS_GRID_SIZE = 5

export const CanvasGrid = pureComponent(
  startWithType<TCanvasGrid>(),
  mapWithPropsMemo(({ width, height }) => ({
    horizontalPositions: Array(Math.ceil(height / CANVAS_GRID_SIZE) + 1)
      .fill(0)
      .map((_, i) => i * CANVAS_GRID_SIZE),
    verticalPositions: Array(Math.ceil(width / CANVAS_GRID_SIZE) + 1)
      .fill(0)
      .map((_, i) => i * CANVAS_GRID_SIZE),
  }), ['width', 'height']),
  mapWithProps(({ shouldDegrade, isCanvasDarkMode }) => ({
    color: (
      shouldDegrade && isCanvasDarkMode ? Colors.GRID_COLOR_DEGRADE_DARK :
      shouldDegrade ? Colors.GRID_COLOR_DEGRADE :
      isCanvasDarkMode ? Colors.GRID_COLOR_DARK :
      Colors.GRID_COLOR
    ),
    colorSoft: (
      shouldDegrade && isCanvasDarkMode ? Colors.GRID_COLOR_DEGRADE_SOFT_DARK :
      shouldDegrade ? Colors.GRID_COLOR_DEGRADE_SOFT :
      isCanvasDarkMode ? Colors.GRID_COLOR_SOFT_DARK :
      Colors.GRID_COLOR_SOFT
    ),
  }))
)(({ horizontalPositions, verticalPositions, width, height, color, colorSoft, shouldDegrade }) => (
  <PrimitiveBlock shouldIgnorePointerEvents top={0} left={0} blendMode={shouldDegrade ? 'initial' : 'difference'}>
    <Surface height={height} width={width}>
      <Group>
        {horizontalPositions.map((position, i) => (
          i % 2 === 1 && (
            <Shape
              key={position}
              d={`M0,${position} ${width},${position}`}
              stroke={colorSoft}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {verticalPositions.map((position, i) => (
          i % 2 === 1 && (
            <Shape
              key={position}
              d={`M${position},0 ${position},${height}`}
              stroke={colorSoft}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {horizontalPositions.map((position, i) => (
          i % 2 === 0 && (
            <Shape
              key={position}
              d={`M0,${position} ${width},${position}`}
              stroke={color}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
      <Group>
        {verticalPositions.map((position, i) => (
          i % 2 === 0 && (
            <Shape
              key={position}
              d={`M${position},0 ${position},${height}`}
              stroke={color}
              strokeWidth={0.5}
            />
          )
        ))}
      </Group>
    </Surface>
  </PrimitiveBlock>
))

CanvasGrid.displayName = 'Grid'
