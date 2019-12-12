import React from 'react'
import { TComponentConfig } from 'autoprops'
import { TVectorShape, VectorShape } from '@primitives/vector-shape'
import { setupVectorShapeTheme, TThemeableVectorShapes } from './src'

type Mappings = {
  demo: { status: 'default' | 'error'},
}

const defaultTheme: TThemeableVectorShapes<Mappings> = {
  demo: ({ status }) => ({
    path: 'M30,0 L30,0 L0,15 L30,30 Z',
    width: 30,
    height: 30,
    color: status === 'default' ? [0x00, 0xFF, 0x00, 1] : [0x00, 0x00, 0xFF, 1],
  }),
}

const { VectorShapeTheme, createThemeableVectorShape } = setupVectorShapeTheme<Mappings>(defaultTheme)

const DemoThemeableVectorShape = createThemeableVectorShape<TVectorShape>('demo', VectorShape)

type TDemo = { status: 'default' | 'error' }

const newTheme: TThemeableVectorShapes<Mappings> = {
  demo: ({ status }) => ({
    path: 'M0,30 L0,30 L15,0 L30,30 Z',
    width: 30,
    height: 30,
    color: status === 'default' ? [0xFF, 0x00, 0x00, 1] : [0x00, 0x00, 0x00, 1],
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean}

export const Component = ({ status, hasTheme }: TDemoComponent) => {
  return (
    hasTheme ? (
      <VectorShapeTheme.Provider value={newTheme}>
        <DemoThemeableVectorShape status={status}/>
      </VectorShapeTheme.Provider>
    ) : (
      <DemoThemeableVectorShape status={status}/>
    )
  )
}

Component.displayName = 'ThemeableVectorShape'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
    status: ['default', 'error'],
  },
}
