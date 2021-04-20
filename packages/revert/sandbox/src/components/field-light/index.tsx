import { Block } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { PrimitiveSize } from '@revert/size'
import { pureComponent, startWithType, mapState, mapContext, mapWithProps, mapFocused } from 'refun'
import type { TMapFocused } from 'refun'
import { isString } from 'tsfn'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_FIELD } from '../../symbols'
import { Border } from '../border'
import type { TField } from '../field'
import { Field } from '../field'
import { PrimitiveText } from '../text'
import { FieldThemeContext, ThemeContext } from '../theme-context'

const HEIGHT = 20
const MIN_WIDTH = 60

export type TFieldLight = {
  type?: TField['type'],
  suffix?: string,
  value: string,
  onChange: (value: string) => void,
  onSubmit?: () => void,
} & TMapFocused

export const FieldLight = pureComponent(
  startWithType<TFieldLight>(),
  mapState('suffixWidth', 'setSuffixWidth', () => 0, ['suffix']),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapContextOverride('FieldThemeProvider', FieldThemeContext, ({ theme, suffixWidth }) => ({
    color: theme.fieldColor,
    rightPadding: suffixWidth,
  })),
  mapFocused,
  mapWithProps(({ isFocused, theme }) => ({
    borderColor: isFocused
      ? theme.fieldFocusedBorderColor
      : theme.fieldBorderColor,
  }))
)(({
  type,
  theme,
  suffixWidth,
  setSuffixWidth,
  suffix,
  value,
  borderColor,
  FieldThemeProvider,
  _width,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
}) => (
  <Block minWidth={MIN_WIDTH} height={HEIGHT}>
    <Border color={borderColor} borderBottomWidth={1}/>
    {isString(suffix) && (
      <PrimitiveSize left={_width - suffixWidth} width={suffixWidth} onWidthChange={setSuffixWidth}>
        <PrimitiveText color={theme.fieldPlaceholderColor}>
          {suffix}
        </PrimitiveText>
      </PrimitiveSize>
    )}
    <FieldThemeProvider>
      <Field
        type={type}
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
