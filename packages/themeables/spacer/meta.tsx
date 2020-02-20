import React from 'react'
import { TComponentConfig } from 'autoprops'
import { Block } from '@primitives/block'
import { Spacer, TSpacer } from '@primitives/spacer'
import { setupSpacerTheme, TThemeableSpacers } from './src'

type TDemo = { status: 'default' | 'error' }

type Mappings = {
  demo: TDemo,
}

const defaultTheme: TThemeableSpacers<Mappings> = {
  demo: ({ status }) => ({
    blockStart: status === 'error' ? 20 : 10,
    blockEnd: 10,
    inlineStart: status === 'error' ? 20 : 10,
    inlineEnd: 10,
  }),
}

const { SpacerTheme, createThemeableSpacer } = setupSpacerTheme<Mappings>(defaultTheme)

export const DemoThemeableSpacer = createThemeableSpacer<TSpacer>('demo', Spacer)

const newTheme: TThemeableSpacers<Mappings> = {
  demo: ({ status }) => ({
    blockStart: 10,
    blockEnd: status === 'error' ? 20 : 10,
    inlineStart: 10,
    inlineEnd: status === 'error' ? 20 : 10,
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
        <SpacerTheme.Provider value={newTheme}>
          <DemoThemeableSpacer status={status}/>
        </SpacerTheme.Provider>
      ) : (
        <DemoThemeableSpacer status={status}/>
      )
    )}
  </Block>
)

Component.displayName = 'ThemeableSpacer'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
