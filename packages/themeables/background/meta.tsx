import React from 'react'
import { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Background, TBackground } from '@primitives/background'
import { setupBackgroundTheme, TThemeableBackgrounds } from './src'

type TDemo = { status: 'default' | 'error' }

type Mappings = {
  demo: TDemo,
}

const defaultTheme: TThemeableBackgrounds<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0xF0, 0xF0, 0xF0, 1] : [0xFF, 0x99, 0x99, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
  }),
}

const { BackgroundTheme, createThemeableBackground } = setupBackgroundTheme<Mappings>(defaultTheme)

export const DemoThemeableBackground = createThemeableBackground<TBackground>('demo', Background)

const newTheme: TThemeableBackgrounds<Mappings> = {
  demo: ({ status }) => ({
    color: status === 'default' ? [0x00, 0x00, 0x00, 1] : [0xFF, 0x00, 0x00, 1],
    bottomLeftRadius: 10,
    bottomRightRadius: 10,
    topLeftRadius: 10,
    topRightRadius: 10,
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
        <BackgroundTheme.Provider value={newTheme}>
          <DemoThemeableBackground status={status}/>
        </BackgroundTheme.Provider>
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
