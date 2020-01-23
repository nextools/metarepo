import React from 'react'
import { TComponentConfig } from 'autoprops'
import { TImage, Image } from '@primitives/image'
import { setupImageTheme, TThemeableImages } from './src'

type TDemo = {}

type Mappings = {
  demo: TDemo,
}

const defaultTheme: TThemeableImages<Mappings> = {
  demo: () => ({
    resizeMode: 'cover',
    width: 100,
    height: 100,
    bottomLeftRadius: 20,
    bottomRightRadius: 20,
    topLeftRadius: 20,
    topRightRadius: 20,
  }),
}

const { ImageTheme, createThemeableImage } = setupImageTheme<Mappings>(defaultTheme)

const DemoThemeableImage = createThemeableImage<TImage>('demo', Image)

const newTheme: TThemeableImages<Mappings> = {
  demo: () => ({
    resizeMode: 'contain',
    width: 70,
    height: 70,
    bottomLeftRadius: 5,
    bottomRightRadius: 5,
    topLeftRadius: 5,
    topRightRadius: 5,
  }),
}

type TDemoComponent = TDemo & { hasTheme: boolean}

export const Component = ({ hasTheme }: TDemoComponent) => {
  return (
    hasTheme ? (
      <ImageTheme.Provider value={newTheme}>
        <DemoThemeableImage
          source='image.png'
          height={200}
          width={200}
        />
      </ImageTheme.Provider>
    ) : (
      <DemoThemeableImage
        source='image.png'
        height={200}
        width={200}
      />
    )
  )
}

Component.displayName = 'ThemeableImage'

export const config: TComponentConfig<TDemoComponent> = {
  props: {
    hasTheme: [true],
  },
}
