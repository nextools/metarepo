import React from 'react'
import { pureComponent, startWithType, mapState, mapContext, TMapFocused, mapWithProps, mapFocused } from 'refun'
import { isString } from 'tsfn'
import { PrimitiveBorder } from '../primitive-border'
import { Field } from '../field'
import { SYMBOL_FIELD } from '../../symbols'
import { SizeBlock } from '../size-block'
import { Size } from '../size'
import { FieldThemeContext, ThemeContext, TextThemeContext } from '../theme-context'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { mapContextOverride } from '../../map/map-context-override'

const HEIGHT = 20
const MIN_WIDTH = 60

export type TFieldLight = {
  suffix?: string,
  value: string,
  onChange: (value: string) => void,
  onSubmit?: () => void,
} & TMapFocused

export const FieldLight = pureComponent(
  startWithType<TFieldLight>(),
  mapState('suffixWidth', 'setSuffixWidth', () => 0, ['suffix']),
  mapContext(ThemeContext),
  mapContextOverride('FieldThemeProvider', FieldThemeContext, ({ theme, suffixWidth }) => ({
    color: theme.fieldColor,
    height: HEIGHT,
    rightPadding: suffixWidth,
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({ theme }) => ({
    color: theme.fieldPlaceholderColor,
  })),
  mapFocused,
  mapWithProps(({ isFocused, theme }) => ({
    borderColor: isFocused
      ? theme.fieldFocusedBorderColor
      : theme.fieldBorderColor,
  }))
)(({
  suffixWidth,
  setSuffixWidth,
  suffix,
  value,
  borderColor,
  FieldThemeProvider,
  TextThemeProvider,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}) => (
  <SizeBlock minWidth={suffixWidth + MIN_WIDTH} height={HEIGHT}>
    <PrimitiveBorder color={borderColor} bottomWidth={1}/>
    {isString(suffix) && (
      <Layout>
        <Layout_Item hAlign="right" vAlign="center">
          <TextThemeProvider>
            <Size width={suffixWidth} onWidthChange={setSuffixWidth}>
              <SizeText>
                {suffix}
              </SizeText>
            </Size>
          </TextThemeProvider>
        </Layout_Item>
      </Layout>
    )}
    <FieldThemeProvider>
      <Field
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </FieldThemeProvider>
  </SizeBlock>
))

FieldLight.displayName = 'FieldLight'
FieldLight.componentSymbol = SYMBOL_FIELD
