import React from 'react'
import { startWithType, TMapHovered, mapHovered, pureComponent, TMapPressed, mapPressed, mapContext, mapWithProps } from 'refun'
import { Pointer } from '@primitives/pointer'
import { elegir } from 'elegir'
import { Label } from '../label'
import { Layout, Layout_Item } from '../layout'
import { SizeText } from '../size-text'
import { ThemeContext } from '../theme-context'
import { SizeBackground } from '../size-background'
import { ComponentSwitch } from './ComponentSwitch'

export type TChildItem = {
  name: string,
  propPath: readonly string[],
  isActive: boolean,
  isRequired: boolean,
  onChange: (propPath: readonly string[], propValue: any) => void,
} & TMapHovered
  & TMapPressed

export const ChildItem = pureComponent(
  startWithType<TChildItem>(),
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
  propPath,
  backgroundColor,
  isActive,
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
        <Layout_Item width={30} vAlign="center">
          <ComponentSwitch
            propPath={propPath}
            isDisabled={isRequired}
            isChecked={isActive}
            onChange={onChange}
          />
        </Layout_Item>

        <Layout_Item vAlign="center">
          <SizeText>
            {name}
          </SizeText>
        </Layout_Item>
      </Layout>
    </Pointer>
  </Label>
))
