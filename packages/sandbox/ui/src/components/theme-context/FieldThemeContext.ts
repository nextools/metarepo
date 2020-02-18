import { createContext } from 'react'
import { TColor, BLACK } from '../../colors'
import { TTextThemeContext } from './TextThemeContext'

export type TFieldThemeContext = TTextThemeContext & {
  placeholderColor: TColor,
  leftPadding: number,
  rightPadding: number,
}

export const FieldThemeContext = createContext<TFieldThemeContext>({
  color: BLACK,
  placeholderColor: BLACK,
  fontSize: 14,
  lineHeight: 20,
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 400,
  leftPadding: 0,
  rightPadding: 0,
})
