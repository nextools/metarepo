import React, { Fragment } from 'react'
import {
  pureComponent,
  startWithType,
  TMapHovered,
  mapWithPropsMemo,
  mapContext,
  TMapKeyboardFocused,
  mapWithProps,
  mapHovered,
  mapKeyboardFocused,
} from 'refun'
import { isUndefined } from 'tsfn'
import { TId } from '../../types'
import { IconDropdownChevronSmall } from '../icons'
import { DropdownThemeContext, TextThemeContext } from '../theme-context'
import { SYMBOL_DROPDOWN, LAYOUT_SIZE_FIT } from '../../symbols'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { SizeContent } from '../size-content'
import { SizeSelect, Option, TOption } from '../size-select'
import { SizeBorder } from '../size-border'
import { TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'

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
    borderColor: isKeyboardFocused ? focusedBorderColor : TRANSPARENT,
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
        <SizeBorder
          color={borderColor}
          width={BORDER_WIDTH}
          overflow={BORDER_OVERFLOW}
          radius={RADIUS}
        />
        <Layout_Item height={HEIGHT} vAlign="center">
          <SizeText shouldPreventSelection shouldHideOverflow shouldPreventWrap>
            {label}
          </SizeText>
        </Layout_Item>
        <Layout_Item width={LAYOUT_SIZE_FIT} height={HEIGHT} vAlign="center">
          <SizeContent>
            <IconDropdownChevronSmall/>
          </SizeContent>
        </Layout_Item>
      </Layout>
    </TextThemeProvider>

    <SizeSelect
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
    </SizeSelect>
  </Fragment>
))

Dropdown.displayName = 'Dropdown'
Dropdown.componentSymbol = SYMBOL_DROPDOWN
