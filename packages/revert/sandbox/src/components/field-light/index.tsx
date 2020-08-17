import { Block } from '@revert/block'
import { Border } from '@revert/border'
import { Layout, Layout_Item } from '@revert/layout'
import { Size } from '@revert/size'
import React from 'react'
import { pureComponent, startWithType, mapState, mapContext, mapWithProps, mapFocused } from 'refun'
import type { TMapFocused } from 'refun'
import { isString } from 'tsfn'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_FIELD } from '../../symbols'
import { Field } from '../field'
import { Text } from '../text'
import { FieldThemeContext, ThemeContext, TextThemeContext } from '../theme-context'

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
  <Block minWidth={suffixWidth + MIN_WIDTH} height={HEIGHT}>
    <Border color={borderColor} borderBottomWidth={1}/>
    {isString(suffix) && (
      <Layout>
        <Layout_Item hAlign="right" vAlign="center">
          <TextThemeProvider>
            <Size width={suffixWidth} onWidthChange={setSuffixWidth}>
              <Text>
                {suffix}
              </Text>
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
  </Block>
))

FieldLight.displayName = 'FieldLight'
FieldLight.componentSymbol = SYMBOL_FIELD
