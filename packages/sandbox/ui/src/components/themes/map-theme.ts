import { startWithType, mapContext, mapWithProps } from 'refun'
import { pipe } from '@psxcode/compose'
import { mapStoreState } from '../../store'
import { ThemeContext } from './Context'

export const mapTheme = <P extends {}> () => pipe(
  startWithType<P & {}>(),
  mapContext(ThemeContext),
  mapStoreState(({ themeName }) => ({
    themeName,
  }), ['themeName']),
  mapWithProps(({ theme, themeName }) => ({
    theme: theme[themeName],
    isDarkTheme: themeName === 'dark',
  }))
)
