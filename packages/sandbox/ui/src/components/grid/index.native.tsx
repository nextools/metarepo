import React from 'react'
import { elegir } from 'elegir'
import { Surface, Group, Shape } from '@primitives/svg'
import { startWithType, mapWithProps, pureComponent, mapWithPropsMemo } from 'refun'
import { Block } from '../block'
import { TThemeName } from '../../types'
import * as Colors from './colors'

const GRID_SIZE = 5

export type TGrid = {
  width: number,
  height: number,
  shouldDegrade: boolean,
  themeName: TThemeName,
}

export const Grid = pureComponent(
  startWithType<TGrid>(),
  mapWithPropsMemo(({ width, height }) => ({
    horizontalPositions: Array(Math.ceil(height / GRID_SIZE) + 1)
      .fill(0)
      .map((_, i) => i * GRID_SIZE),
    verticalPositions: Array(Math.ceil(width / GRID_SIZE) + 1)
      .fill(0)
      .map((_, i) => i * GRID_SIZE),
  }), ['width', 'height']),
  mapWithProps(({ shouldDegrade, themeName }) => ({
    color: elegir(
      shouldDegrade && themeName === 'dark',
      Colors.GRID_COLOR_DEGRADE_DARK,
      shouldDegrade,
      Colors.GRID_COLOR_DEGRADE,
      themeName === 'dark',
      Colors.GRID_COLOR_DARK,
      true,
      Colors.GRID_COLOR
    ),
    colorSoft: elegir(
      shouldDegrade && themeName === 'dark',
      Colors.GRID_COLOR_DEGRADE_SOFT_DARK,
      shouldDegrade,
      Colors.GRID_COLOR_DEGRADE_SOFT,
      themeName === 'dark',
      Colors.GRID_COLOR_SOFT_DARK,
      true,
      Colors.GRID_COLOR_SOFT
    ),
  }))
)(({ horizontalPositions, verticalPositions, width, height, color, colorSoft, shouldDegrade }) => (
  <Block shouldIgnorePointerEvents top={0} left={0} blendMode={shouldDegrade ? 'initial' : 'difference'}>
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
  </Block>
))

Grid.displayName = 'Grid'
