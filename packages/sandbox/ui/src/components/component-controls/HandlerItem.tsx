import React from 'react'
import { startWithType, TMapHovered, mapHovered, pureComponent, TMapPressed, mapPressed, mapContext, mapWithProps } from 'refun'
import { Pointer } from '@primitives/pointer'
import { elegir } from 'elegir'
import { Label } from '../label'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { ThemeContext } from '../theme-context'
import { SizeBackground } from '../size-background'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { ValueCheckbox } from './ValueCheckbox'

export type THandlerItem = {
  name: string,
  possibleValues: readonly any[],
  propPath: readonly string[],
  value: any,
  isRequired: boolean,
  onChange: (propPath: readonly string[], propValue: any) => void,
} & TMapHovered
  & TMapPressed

export const HandlerItem = pureComponent(
  startWithType<THandlerItem>(),
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
  propPath,
  backgroundColor,
  possibleValues,
  isRequired,
  onPointerEnter,
  onPointerLeave,
  onPressIn,
  onPressOut,
  onChange,
}) => (
  <Label>
    <Pointer isDisabled={isRequired} onEnter={onPointerEnter} onLeave={onPointerLeave} onDown={onPressIn} onUp={onPressOut}>
      <Layout hPadding={20} spaceBetween={10}>
        <SizeBackground color={backgroundColor}/>
        <Layout_Item vAlign="center">
          <SizeText shouldHideOverflow>
            {name}
          </SizeText>
        </Layout_Item>

        <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
          {isRequired
            ? (
              <SizeText>
                Required
              </SizeText>
            ) : (
              <ValueCheckbox
                checkedPropValue={possibleValues[0]}
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
