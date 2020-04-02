import React, { FC } from 'react'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Button } from '@revert/button'
import { Block } from '@revert/block'
import { Surface, Shape } from '@revert/svg'
import { Scroll } from '@revert/scroll'
import { Background } from '@revert/background'
import { Border } from '@revert/border'
import { Shadow } from '@revert/shadow'
import { Checkbox } from '@revert/checkbox'
import { Input, TPrimitiveInput } from '@revert/input'
import { Root } from '@revert/root'
import { component, startWithType, mapState, mapHandlers, mapWithProps, mapKeyboardFocused, TMapKeyboardFocused } from 'refun'
import { TColor } from '@revert/color'
import { Text } from '@revert/text'
import { TOmitKey } from 'tsfn'

const TRANSPARENT: TColor = [255, 255, 255, 0]
const WHITE: TColor = [255, 255, 255, 1]
const BLACK: TColor = [0, 0, 0, 1]

const Icon: FC<{ d: string, size: number }> = ({ d, size }) => (
  <Block width={size} height={size}>
    <Surface width={size} height={size}>
      <Shape d={d}/>
    </Surface>
  </Block>
)

const FixedHeight: FC<{ height: number }> = ({ height, children }) => (
  <Layout direction="vertical">
    <Layout_Item height={height}>
      {children}
    </Layout_Item>
  </Layout>
)

const CHK_ACTIVE_BG: TColor = [0, 255, 0, 0.4]
const CHK_BG: TColor = [255, 255, 255, 1]
const CHK_ACTIVE_BOR: TColor = [255, 0, 0, 0.4]
const CHK_BOR: TColor = [0, 0, 0, 0.5]

const Chk = component(
  startWithType<{ size: number, children: string } & TMapKeyboardFocused>(),
  mapState('isChecked', 'setChecked', () => false, []),
  mapKeyboardFocused,
  mapWithProps(({ isChecked, isKeyboardFocused }) => ({
    d: isChecked
      ? 'M10.215 1L4.292 8.558 1.414 5.68 0 7.094l3.676 3.676a1 1 0 00.707.293l.06-.002c.286-.018.55-.157.727-.381l6.619-8.446L10.215 1z'
      : '',
    backgroundColor: isChecked ? CHK_ACTIVE_BG : CHK_BG,
    borderColor: isChecked ? CHK_ACTIVE_BOR : CHK_BOR,
    keyboardColor: isKeyboardFocused ? CHK_ACTIVE_BOR : TRANSPARENT,
  })),
  mapHandlers({
    onToggle: ({ isChecked, setChecked }) => () => {
      setChecked(!isChecked)
    },
  })
)(({
  d,
  size,
  backgroundColor,
  borderColor,
  keyboardColor,
  children,
  isChecked,
  onToggle,
  onBlur,
  onFocus,
  onPressIn,
  onPressOut,
}) => (
  <FixedHeight height={size}>
    <Border color={keyboardColor} width={4} overflow={6} radius={14}/>
    <Checkbox isChecked={isChecked} onToggle={onToggle} onBlur={onBlur} onFocus={onFocus} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Layout>
        <Layout_Item width={size}>
          <Background color={backgroundColor} radius={10}/>
          <Border color={borderColor} width={2} radius={10}/>
          <Layout>
            <Layout_Item hAlign="center" vAlign="center">
              <Icon d={d} size={12}/>
            </Layout_Item>
          </Layout>
        </Layout_Item>
        <Layout_Item vAlign="center" hPadding={10}>
          <Text>{children}</Text>
        </Layout_Item>
      </Layout>
    </Checkbox>
  </FixedHeight>
))

/* BUTTON */

type TBtn = {
  backgroundColor: TColor,
  borderColor: TColor,
}

const Btn = component(
  startWithType<TBtn>(),
  mapState('btnText', 'setBtnText', () => 'button', []),
  mapHandlers({
    onPress: ({ btnText, setBtnText }) => () => {
      setBtnText(btnText === 'button' ? 'buttonas asdasdas asdasd asdasd dasdasd' : 'button')
    },
  })
)(({ backgroundColor, borderColor, btnText, onPress }) => (
  <Layout>
    <Background color={backgroundColor} radius={10}/>
    <Border color={borderColor} width={2} radius={10}/>
    <Shadow color={borderColor} blurRadius={10} radius={10}/>
    <Layout_Item hAlign="center" vAlign="center" hPadding={20} vPadding={20}>
      <Button onPress={onPress}>
        <Text>{btnText}</Text>
      </Button>
    </Layout_Item>
  </Layout>
))

/* INPUT */

const Inp = component(
  startWithType<TOmitKey<TPrimitiveInput, 'value' | 'onChange'>>(),
  mapState('value', 'setValue', () => 'Input text', [])
)(({ value, setValue, ...props }) => (
  <Block minWidth={100} height={40}>
    <Background color={WHITE} radius={10}/>
    <Border color={BLACK} width={2} radius={10}/>
    <Shadow color={BLACK} blurRadius={2} radius={10}/>
    <Input
      paddingLeft={10}
      paddingRight={10}
      {...props}
      value={value}
      onChange={setValue}
    />
  </Block>
))

export const App = component(
  startWithType<{}>()
)(() => (
  <Root>
    <Layout direction="vertical" spaceBetween={20} hPadding={20} vPadding={20}>
      <Layout_Item height={50}>
        <Background color={[78, 90, 39, 1]}/>
      </Layout_Item>
      <Layout_Item>
        <Layout direction="horizontal" spaceBetween={20}>
          <Layout_Item width={100}>
            <Layout direction="vertical" spaceBetween={20}>
              <Layout_Item>
                <Background color={[103, 147, 58, 1]}/>
              </Layout_Item>
              <Layout_Item>
                <Background color={[148, 139, 117, 1]}/>
              </Layout_Item>
            </Layout>
          </Layout_Item>
          <Layout_Item>
            <Background color={[252, 224, 167, 1]}/>
            <Scroll shouldScrollVertically>
              <Layout direction="vertical">
                <Layout_Item height={400} hAlign="center" vAlign="center">
                  <Btn
                    borderColor={[255, 0, 0, 0.4]}
                    backgroundColor={[0, 0, 255, 0.2]}
                  />
                </Layout_Item>
                <Layout_Item height={200} hAlign="center" vAlign="center">
                  <Background color={[255, 0, 0, 0.4]}/>
                  <Inp/>
                </Layout_Item>
              </Layout>
            </Scroll>
          </Layout_Item>
          <Layout_Item width={100}>
            <Background color={[245, 211, 106, 1]}/>
          </Layout_Item>
        </Layout>
      </Layout_Item>
      <Layout_Item height={200}>
        <Background color={[204, 200, 111, 1]}/>
        <Layout hPadding={20} vPadding={20}>
          <Layout_Item width={LAYOUT_SIZE_FIT} hPadding={20} vPadding={20}>
            <Background color={[0, 0, 255, 0.2]}/>
            <Chk size={32}>
              Checkmark
            </Chk>
          </Layout_Item>
          <Layout_Item hAlign="center" hPadding={20} vPadding={20}>
            <Background color={[0, 0, 255, 0.2]}/>
            <Chk size={64}>
              is enabled
            </Chk>
          </Layout_Item>
        </Layout>
      </Layout_Item>
    </Layout>
  </Root>
))
