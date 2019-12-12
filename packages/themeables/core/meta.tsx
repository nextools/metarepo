import React from 'react'
import { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Background, TBackground } from '@primitives/background'
import { TThemeableBackground } from '@themeables/background'
import { setupTheme, TThemeables } from './src'

type TDemo = { status: 'default' | 'error' }

const SYMBOL_DEMO = Symbol('Demo')

type Mappings = {
  [SYMBOL_DEMO]: TDemo,
}

const defaultTheme: TThemeables<TThemeableBackground, Mappings> = {
  [SYMBOL_DEMO]: ({ status }) => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
  }),
}

const { ThemePiece, createThemeable } = setupTheme<TThemeableBackground, Mappings>(defaultTheme)

export const DemoThemeableBackground = createThemeable<TBackground>(SYMBOL_DEMO, Background)

const newTheme: TThemeables<TThemeableBackground, Mappings> = {
  [SYMBOL_DEMO]: ({ status }) => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x00, 0x00, 1],
    bottomLeftRadius: 5,
    bottomRightRadius: 5,
    topLeftRadius: 5,
    topRightRadius: 5,
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean}

export const Component = ({ status, hasTheme }: TDemoComponent) => (
  <Block
    style={{
      width: 100,
      height: 100,
    }}
  >
    {(
      hasTheme ? (
        <ThemePiece.Provider value={newTheme}>
          <DemoThemeableBackground status={status}/>
        </ThemePiece.Provider>
      ) : (
        <DemoThemeableBackground status={status}/>
      )
    )}
  </Block>
)

Component.displayName = 'ThemeableBackground'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
