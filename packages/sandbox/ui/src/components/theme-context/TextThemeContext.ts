import { createContext } from 'react'
import { TStyle } from 'stili'
import { BLACK, TColor } from '../../colors'

export type TTextThemeContext = {
  color: TColor,
  fontFamily: string,
  fontWeight: TStyle['fontWeight'],
  fontSize: number,
  lineHeight: number,
}

export const TextThemeContext = createContext<TTextThemeContext>({
  color: BLACK,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  fontSize: 16,
  lineHeight: 20,
})
