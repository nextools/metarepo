import { createContext, useContext, createElement, FC } from 'react'
import { component, startWithType } from 'refun'

export type TThemeables<ThemeType, ComponentMappings> = { [key in keyof ComponentMappings]: (props: ComponentMappings[key]) => ThemeType }

export const setupTheme = <ThemeType, ComponentMappings>(defaultTheme: TThemeables<ThemeType, ComponentMappings>) => {
  const ThemePiece = createContext(defaultTheme)

  type K = keyof ComponentMappings

  const createThemeable = <P extends ThemeType>(name: K, Target: FC<any>) => {
    const Themeable = component(
      startWithType<Partial<P> & ComponentMappings[K]>(),
      (props) => ({
        ...useContext(ThemePiece)[name](props),
        ...props,
      })
    )((props) => createElement(Target, props))

    const matched = name.toString().match(/^Symbol\((.+)\)$/)

    Themeable.displayName = matched?.[1] ?? `${name}`

    return Themeable
  }

  return {
    createThemeable,
    ThemePiece,
  }
}
