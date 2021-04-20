import { Label } from '@revert/label'
import { Layout, Layout_Item } from '@revert/layout'
import { Pointer } from '@revert/pointer'
import { startWithType, mapHovered, mapWithProps, pureComponent, mapPressed, mapContext, mapDefaultProps } from 'refun'
import type { TMapHovered, TMapPressed } from 'refun'
import { SYMBOL_CONTROL_DROPDOWN, SYMBOL_CONTROL_SWITCH, SYMBOL_CONTROL_COLOR } from '../../symbols'
import type { TComponentControlSymbols } from '../../types'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'
import { ValueCheckbox } from './ValueCheckbox'
import { ValueDropdown } from './ValueDropdown'
import { printColor } from './print-value'

export type TPropsItem = {
  name: string,
  possibleValues: readonly any[],
  propPath: readonly string[],
  value: any,
  controlSymbol?: TComponentControlSymbols,
  isRequired: boolean,
  onChange: (propPath: readonly string[], propValue: any) => void,
} & TMapHovered
  & TMapPressed

export const PropsItem = pureComponent(
  startWithType<TPropsItem>(),
  mapDefaultProps({
    controlSymbol: SYMBOL_CONTROL_DROPDOWN,
  }),
  mapContext(ThemeContext),
  mapHovered,
  mapPressed,
  mapWithProps(({ isHovered, isPressed, theme }) => ({
    backgroundColor: (
      isPressed ? theme.controlsSidebarPressedBackgroundColor :
      isHovered ? theme.controlsSidebarHoveredBackgroundColor :
      theme.controlsSidebarBackgroundColor
    ),
  }))
)(({
  name,
  value,
  possibleValues,
  propPath,
  backgroundColor,
  controlSymbol,
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
        <Background color={backgroundColor}/>
        <Layout_Item vAlign="center">
          <Text shouldHideOverflow>
            {name}
          </Text>
        </Layout_Item>
        <Layout_Item hAlign="right" vAlign="center">
          {controlSymbol === SYMBOL_CONTROL_SWITCH
            ? (
              <ValueCheckbox
                propPath={propPath}
                propValue={value}
                checkedPropValue
                onChange={onChange}
              />
            )
            : controlSymbol === SYMBOL_CONTROL_COLOR
              ? (
                <ValueDropdown
                  propPossibleValues={possibleValues}
                  isPropRequired={isRequired}
                  propPath={propPath}
                  propValue={value}
                  printValue={printColor}
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
