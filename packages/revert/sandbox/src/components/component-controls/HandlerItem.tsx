import { Label } from '@revert/label'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Pointer } from '@revert/pointer'
import { startWithType, mapHovered, pureComponent, mapPressed, mapContext, mapWithProps } from 'refun'
import type { TMapHovered, TMapPressed } from 'refun'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'
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
    backgroundColor: (
      isPressed ? theme.controlsSidebarPressedBackgroundColor :
      isHovered ? theme.controlsSidebarHoveredBackgroundColor :
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
        <Background color={backgroundColor}/>
        <Layout_Item vAlign="center">
          <Text shouldHideOverflow>
            {name}
          </Text>
        </Layout_Item>

        <Layout_Item width={LAYOUT_SIZE_FIT} vAlign="center">
          {isRequired
            ? (
              <Text>
                Required
              </Text>
            )
            : (
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
