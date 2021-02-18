import { Background } from '@revert/background'
import { Border } from '@revert/border'
import { Layout, Layout_Item } from '@revert/layout'
import { SYMBOL_CONTROL_SWITCH } from '@revert/sandbox'
import type { TComponentControls } from '@revert/sandbox'
import { Shadow } from '@revert/shadow'
import type { TComponentConfig } from 'autoprops'
import type { TComponent } from 'refun'
import * as TextMeta from '../text/meta'
import { Button } from './src'
import type { TButton } from './src'

export const Component: TComponent<TButton> = (props) => (
  <Layout>
    <Background color={0xffeeeeff} radius={10}/>
    <Border color={0xff0000a0} borderWidth={2} radius={10}/>
    <Shadow color={0xff0000a0} blurRadius={10} radius={10}/>
    <Layout_Item hAlign="center" vAlign="center" hPadding={20} vPadding={20}>
      <Button {...props}/>
    </Layout_Item>
  </Layout>
)

Component.displayName = Button.displayName
Component.componentSymbol = Button.componentSymbol

export const config: TComponentConfig<TButton, 'text'> = {
  props: {
    accessibilityLabel: ['Button'],
    isDisabled: [true],
    onPress: [() => {}],
  },
  children: {
    text: TextMeta,
  },
  required: ['text'],
}

export { default as packageJson } from './package.json'

export const controls: TComponentControls<TButton> = {
  isDisabled: SYMBOL_CONTROL_SWITCH,
}
