import React from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  TMapFocused,
  mapHandlers,
  mapContext,
} from 'refun'
import { isFunction, isString } from 'tsfn'
import { PrimitiveInput } from '../primitive-input'
import { PrimitiveText } from '../primitive-text'
import { AnimationColor } from '../animation'
import { TId } from '../../types'
import { SYMBOL_FIELD } from '../../symbols'
import { SizeBlock } from '../size-block'
import { FieldThemeContext } from '../theme-context'
import { PrimitiveBlock } from '../primitive-block'

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
  <SizeBlock minWidth={100} height={HEIGHT}>
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
  </SizeBlock>
))

Field.displayName = 'Field'
Field.componentSymbol = SYMBOL_FIELD
