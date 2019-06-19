import { TextStyle } from 'react-native' // eslint-disable-line
import { TExtend, getObjectKeys, isUndefined } from 'tsfn'

export type TStyle = TExtend<TextStyle, {
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
}>

type TCssProps = TextStyle

export const normalizeStyle = (style: TStyle): TCssProps =>
  getObjectKeys(style).reduce((result, key) => {
    const value = style[key]

    if (key === 'fontWeight' && !isUndefined(value)) {
      result.fontWeight = String(value) as TCssProps['fontWeight']
    }

    // FIXME
    // @ts-ignore
    result[key] = value

    return result
  }, {} as TCssProps)
