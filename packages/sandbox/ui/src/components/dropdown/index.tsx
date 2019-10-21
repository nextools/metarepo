import React from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  mapHovered,
  mapWithProps,
  TMapFocused,
  mapFocused,
  mapWithPropsMemo,
} from 'refun'
import { elegir } from 'elegir'
import { Select, TOption } from '@primitives/select'
import { Pointer } from '@primitives/pointer'
import { isUndefined } from 'tsfn'
import { Background } from '../background'
import { Block } from '../block'
import { Text } from '../text'
import { TRect } from '../../types'
import { IconChevronDown } from '../icons'
import { mapTheme } from '../themes'

const LINE_HEIGHT = 19
const RADIUS = 5
const INPUT_PADDING = 10
const ICON_SIZE = 20

export type TDropdown = {
  value: string,
  options: readonly TOption[],
  onChange: (value: string) => void,
} & TMapHovered
  & TMapFocused
  & TRect

export const Dropdown = pureComponent(
  startWithType<TDropdown>(),
  mapTheme(),
  mapHovered,
  mapFocused,
  mapWithPropsMemo(({ options, value }) => {
    const selectedOption = options.find((opt) => opt.value === value)

    return {
      label: isUndefined(selectedOption) ? 'NOT_FOUND' : selectedOption.label,
    }
  }, ['options', 'value']),
  mapWithProps(({ isHovered, isFocused, theme }) => ({
    color: theme.text,
    backgroundColor: elegir(
      isHovered || isFocused,
      theme.foregroundHover,
      true,
      theme.foreground
    ),
  }))
)(({
  left,
  top,
  width,
  height,
  color,
  backgroundColor,
  options,
  value,
  label,
  onChange,
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
      <Block
        shouldIgnorePointerEvents
        width={ICON_SIZE}
        height={ICON_SIZE}
        left={width - INPUT_PADDING - ICON_SIZE}
        top={(height - ICON_SIZE) / 2}
      >
        <IconChevronDown color={color}/>
      </Block>
      <Block left={0} top={0} width={width} height={height}>
        <Select
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </Select>
      </Block>
      <Block
        shouldHideOverflow
        shouldIgnorePointerEvents
        left={INPUT_PADDING}
        top={(height - LINE_HEIGHT) / 2}
        width={width - ICON_SIZE - INPUT_PADDING * 3}
        height={height}
      >
        <Text
          shouldPreventWrap
          color={color}
        >
          {label}
        </Text>
      </Block>
    </Pointer>
  </Block>
))

Dropdown.displayName = 'Dropdown'
