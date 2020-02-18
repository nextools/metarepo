import React from 'react'
import { startWithType, TMapHovered, mapHovered, mapWithProps, pureComponent, TMapPressed, mapPressed, mapContext } from 'refun'
import { Pointer } from '@primitives/pointer'
import { isUndefined } from 'tsfn'
import { elegir } from 'elegir'
import { Label } from '../label'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { ThemeContext } from '../theme-context'
import { SizeBackground } from '../size-background'
import { ValueCheckbox } from './ValueCheckbox'
import { ValueDropdown } from './ValueDropdown'

const isCheckboxValues = (propConfig: readonly any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'boolean')

export type TPropsItem = {
  name: string,
  possibleValues: readonly any[],
  propPath: readonly string[],
  value: any,
  isRequired: boolean,
  onChange: (propPath: readonly string[], propValue: any) => void,
} & TMapHovered
  & TMapPressed

export const PropsItem = pureComponent(
  startWithType<TPropsItem>(),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapWithProps(({ isHovered, isPressed, theme }) => ({
    backgroundColor: elegir(
      isPressed,
      theme.controlsSidebarPressedBackgroundColor,
      isHovered,
      theme.controlsSidebarHoveredBackgroundColor,
      true,
      theme.controlsSidebarBackgroundColor
    ),
  }))
)(({
  name,
  value,
  possibleValues,
  propPath,
  backgroundColor,
  isRequired,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onChange,
}) => (
  <Label>
    <Pointer onEnter={onPointerEnter} onLeave={onPointerLeave} onDown={onPressIn} onUp={onPressOut}>
      <Layout hPadding={20} spaceBetween={10}>
        <SizeBackground color={backgroundColor}/>
        <Layout_Item vAlign="center">
          <SizeText shouldHideOverflow>
            {name}
          </SizeText>
        </Layout_Item>
        <Layout_Item hAlign="right" vAlign="center">
          {isCheckboxValues(possibleValues)
            ? (
              <ValueCheckbox
                propPath={propPath}
                propValue={value}
                checkedPropValue
                onChange={onChange}
              />
            )
            : (
              <ValueDropdown
                propPossibleValues={possibleValues}
                isPropRequired={isRequired}
                propPath={propPath}
                propValue={value}
                onChange={onChange}
              />
            )}
        </Layout_Item>
      </Layout>
    </Pointer>
  </Label>
))
