import { AnimationColor } from '@revert/animation'
import { PrimitiveBlock, Block } from '@revert/block'
import { PrimitiveInput } from '@revert/input'
import { PrimitiveText } from '@revert/text'
import React from 'react'
import {
  pureComponent,
  startWithType,
  mapHandlers,
  mapContext,
} from 'refun'
import type { TMapHovered, TMapFocused } from 'refun'
import { isFunction, isString } from 'tsfn'
import { SYMBOL_FIELD } from '../../symbols'
import type { TId } from '../../types'
import { FieldThemeContext } from '../theme-context'

const HEIGHT = 20

export type TField = {
  placeholder?: string,
  value: string,
  onChange: (value: string) => void,
  onSubmit?: () => void,
} & TId
  & TMapHovered
  & TMapFocused

export const Field = pureComponent(
  startWithType<TField>(),
  mapContext(FieldThemeContext),
  mapHandlers({
    onBlur: ({ onBlur, onSubmit }) => () => {
      if (isFunction(onBlur)) {
        onBlur()
      }

      if (isFunction(onSubmit)) {
        onSubmit()
      }
    },
  })
)(({
  lineHeight,
  color,
  leftPadding,
  rightPadding,
  fontFamily,
  fontSize,
  fontWeight,
  value,
  placeholder,
  placeholderColor,
  id,
  onChange,
  onSubmit,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
}) => (
  <Block minWidth={100} height={HEIGHT}>
    {value.length === 0 && isString(placeholder) && (
      <PrimitiveBlock left={leftPadding} top={(HEIGHT - lineHeight) / 2} shouldIgnorePointerEvents>
        <PrimitiveText
          color={placeholderColor}
          fontFamily={fontFamily}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontWeight={fontWeight}
          shouldPreventWrap
        >
          {placeholder}
        </PrimitiveText>
      </PrimitiveBlock>
    )}
    <AnimationColor toColor={color}>
      {(color) => (
        <PrimitiveInput
          id={id}
          fontFamily={fontFamily}
          fontWeight={fontWeight}
          fontSize={fontSize}
          lineHeight={lineHeight}
          color={color}
          paddingLeft={leftPadding}
          paddingRight={rightPadding}
          paddingTop={(HEIGHT - lineHeight) / 2}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          onFocus={onFocus}
          onBlur={onBlur}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
        />
      )}
    </AnimationColor>
  </Block>
))

Field.displayName = 'Field'
Field.componentSymbol = SYMBOL_FIELD
