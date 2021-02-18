import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Select, Option } from '@revert/select'
import type { TOption } from '@revert/select'
import { Size } from '@revert/size'
import { TextThemeContext } from '@revert/text'
import { Fragment } from 'react'
import {
  pureComponent,
  startWithType,
  mapWithPropsMemo,
  mapContext,
  mapWithProps,
  mapHovered,
  mapKeyboardFocused,
} from 'refun'
import type { TMapHovered, TMapKeyboardFocused } from 'refun'
import { isUndefined } from 'tsfn'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { SYMBOL_DROPDOWN } from '../../symbols'
import type { TId } from '../../types'
import { Border } from '../border'
import { IconDropdownChevronSmall } from '../icons'
import { Text } from '../text'
import { DropdownThemeContext } from '../theme-context'

const BORDER_WIDTH = 2
const BORDER_OVERFLOW = 4
const RADIUS = 9
const HEIGHT = 20

export type TDropdown = {
  value: string,
  options: readonly TOption[],
  onChange: (value: string) => void,
} & TId
  & TMapHovered
  & TMapKeyboardFocused

export const Dropdown = pureComponent(
  startWithType<TDropdown>(),
  mapContext(DropdownThemeContext),
  mapHovered,
  mapKeyboardFocused,
  mapWithProps(({ isKeyboardFocused, focusedBorderColor }) => ({
    borderColor: isKeyboardFocused ? focusedBorderColor : COLOR_TRANSPARENT,
  })),
  mapContextOverride('TextThemeProvider', TextThemeContext, ({
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    color,
    hoveredColor,
    isHovered,
  }) => ({
    color: isHovered ? hoveredColor : color,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
  })),
  mapWithPropsMemo(({ options, value }) => {
    const selectedOption = options.find((opt) => opt.value === value)

    return {
      label: isUndefined(selectedOption) ? 'NOT_FOUND' : selectedOption.label,
    }
  }, ['options', 'value'])
)(({
  options,
  value,
  label,
  id,
  TextThemeProvider,
  borderColor,
  onChange,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  onPressIn,
  onPressOut,
}) => (
  <Fragment>
    <TextThemeProvider>
      <Layout hPadding={5} spaceBetween={5}>
        <Border
          color={borderColor}
          borderWidth={BORDER_WIDTH}
          overflow={BORDER_OVERFLOW}
          radius={RADIUS}
        />
        <Layout_Item height={HEIGHT} vAlign="center">
          <Text shouldPreventSelection shouldHideOverflow shouldPreventWrap>
            {label}
          </Text>
        </Layout_Item>
        <Layout_Item width={LAYOUT_SIZE_FIT} height={HEIGHT} vAlign="center">
          <Size>
            <IconDropdownChevronSmall/>
          </Size>
        </Layout_Item>
      </Layout>
    </TextThemeProvider>

    <Select
      id={id}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {options.map(({ value, label }) => (
        <Option
          key={value}
          label={label}
          value={value}
        />
      ))}
    </Select>
  </Fragment>
))

Dropdown.displayName = 'Dropdown'
Dropdown.componentSymbol = SYMBOL_DROPDOWN
