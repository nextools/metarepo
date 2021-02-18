import { Label } from '@revert/label'
import { Layout, Layout_Item } from '@revert/layout'
import { Pointer } from '@revert/pointer'
import { startWithType, mapHovered, pureComponent, mapPressed, mapContext, mapWithProps } from 'refun'
import type { TMapHovered, TMapPressed } from 'refun'
import { Background } from '../background'
import { Text } from '../text'
import { ThemeContext } from '../theme-context'
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
    backgroundColor: (
      isPressed ? theme.controlsSidebarPressedBackgroundColor :
      isHovered ? theme.controlsSidebarHoveredBackgroundColor :
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
        <Background color={backgroundColor}/>
        <Layout_Item width={30} vAlign="center">
          <ComponentSwitch
            propPath={propPath}
            isDisabled={isRequired}
            isChecked={isActive}
            onChange={onChange}
          />
        </Layout_Item>

        <Layout_Item vAlign="center">
          <Text>
            {name}
          </Text>
        </Layout_Item>
      </Layout>
    </Pointer>
  </Label>
))
