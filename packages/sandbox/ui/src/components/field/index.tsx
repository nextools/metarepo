import React from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  mapHovered,
  mapWithProps,
  TMapFocused,
  mapFocused,
  mapHandlers,
} from 'refun'
import { elegir } from 'elegir'
import { Input } from '@primitives/input'
import { Pointer } from '@primitives/pointer'
import { Background } from '../background'
import { AnimationColor } from '../animation-color'
import { Block } from '../block'
import { TRect } from '../../types'
import { mapTheme } from '../themes'

const FAMILY = `Helvetica, Arial, sans-serif`
const WEIGHT = 400
const SIZE = 14
const LINE_HEIGHT = 20
const RADIUS = 5
const INPUT_PADDING = 10

export type TField = {
  value: string,
  onChange: (value: string) => void,
  onSubmit: () => void,
} & TMapHovered
  & TMapFocused
  & TRect

export const Field = pureComponent(
  startWithType<TField>(),
  mapTheme(),
  mapHovered,
  mapFocused,
  mapWithProps(({ isHovered, isFocused, theme }) => ({
    color: theme.text,
    backgroundColor: elegir(
      isHovered || isFocused,
      theme.foregroundHover,
      true,
      theme.foreground
    ),
  })),
  mapHandlers({
    onBlur: ({ onBlur, onSubmit }) => () => {
      onBlur()
      onSubmit()
    },
  })
)(({
  left,
  top,
  width,
  height,
  color,
  backgroundColor,
  value,
  onChange,
  onSubmit,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}) => (
  <Block
    left={left}
    top={top}
    width={width}
    height={height}
  >
    <Pointer
      onEnter={onPointerEnter}
      onLeave={onPointerLeave}
    >
      <Background
        color={backgroundColor}
        topLeftRadius={RADIUS}
        topRightRadius={RADIUS}
        bottomLeftRadius={RADIUS}
        bottomRightRadius={RADIUS}
      />
      <Block left={0} top={0} width={width} height={height}>
        <AnimationColor values={color}>
          {(color) => (
            <Input
              fontFamily={FAMILY}
              fontWeight={WEIGHT}
              fontSize={SIZE}
              lineHeight={LINE_HEIGHT}
              color={color}
              paddingLeft={INPUT_PADDING}
              paddingRight={INPUT_PADDING}
              value={value}
              onChange={onChange}
              onSubmit={onSubmit}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          )}
        </AnimationColor>
      </Block>
    </Pointer>
  </Block>
))

Field.displayName = 'Field'
