# @themeables

Themeable UI primitive set for building cross-platform (web + React Native) design systems.

## Why?

HTML provides a set of semantic and structural elements to describe documents—and, pushing them a bit, applications.

React Native provides abstracted analogs of the HTML elements, reduced in their capacity and semantic content. While the React Native analogs—`View`, `Text`, `TextInput`, ...—lack many of the optios of HTML elements, their design and APIs go some way towards creating a set of true fundamental building blocks of UIs.

The [`@primitives`](../primitives) library provides a cross-platform set of components that map the React Native concepts to their HTML equivalents, and it takes the abstraction one step further. On top of the `@primitives`, it is possible to build truly universal applications. In taking the React Native and web APIs to their logical conclusion however, they bring to the fore the limitations of their model. In particular, they show that React Native components are still too powerful and unfocused on their APIs, and the conflation of responsibilities makes it harder to design a truly composable design system on top of them. To give an example: a `Block` components—the `@primitives` equivalent of a `View`—supports configuration for margins, sizes, background styles, borders and—on web and iOS—shadows; but these 5 features are fundamentally different things when thinking about them from the design systematization side.

This is where `@themeable` fits in. The set of components in the `@themeable` library aims to cover the spectrum of _design oriented_ UI primitives, with the particular goal of making design system building simpler. The themeable pieces are what you would expect if you come from the design side:

- [`@themeables/background`](background)
- [`@themeables/border`](border)
- [`@themeables/image`](image)
- [`@themeables/text`](text)
- [`@themeables/vector-shape`](vector-shape)

> Please refer to each particular component readme for more details on APIs and behaviors

> The list of themeables is a work in progress. TODO themeables include `@themeables/motion`, `@themeables/layout` and `@themeables/spacer`

## How?

On top of providing abstractions for the concepts of a background, border, …, themeables take care of another crucial need of design systems: they are, well, _themeable_.

What does it mean for them to be themeable? It means that in order to create one of this components, you need to provide a series of functions that receive the props of the components and return a valid set of styles for the type of themeable that you want to use. This becomes the default theme. But together with this themeable component, you also receive back a `React.context`, and you can use the `Provider` in said `React.context` to _override_ the default theme. This means that redesigns of the styles of the design system will no longer require the components of said design system to be modified, just the _theme_ passed in at the root level to the theme providers of each themeable.

`@themeable` are built with TypeScript, so type checking for your themes is available. When you create your own theme set, you can verify at build time if the themes match the expected description.

## What?

Pretty much this:

```tsx
import React from 'react'
import { Block } from '@primitives/block'
import { setupBackgroundTheme, TThemeableBackgrounds } from '@themeables/background'
import { TBackground, Background } from '@primitives/background'

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

export const ThemeableBackground = ({ status, hasTheme }: TDemoComponent) => (
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
```

Notice how:

- The `defaultTheme` is an object with a series of functions. The key of each function is essentially the `name` of the component, and the function itself goes from the `props` that the component is expected to receive, to the type of the style the themeable receives
- `setupBackgroundTheme` receives a default theme, and if you are using TypeScript, it also requires a type that maps the `name` of the component to the type of the `props` that component will receive. This way, type checking of the input props for this component can be done.
- `setupBackgroundTheme` returns two results:
  - `BackgroundTheme` is a `React.context`, which you can use to set an overriding theme such as in `<BackgroundTheme.Provider value={newTheme}>
  - `createThemeableBackground` is a function that returns a new _React Component_. To create this component, it receives a `name` property and a `Target` component which input props must satisfy the `TThemeableBackground` props, and the resulting comomponent will receive the `props` specified under the key with that name in the mapping type, run the function provided under its name in the `theme`, and pass the resulting theme properties down into the `Target` component.

## Documentation TODO

- [ ] Document difference between `@themeables/vector-shape` and plain SVG
- ~[ ] Document behavior of Background and Border regarding fitting the container.~ No need! That is delegated 100% to the primitives
