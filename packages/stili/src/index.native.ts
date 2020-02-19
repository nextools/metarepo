import { TextStyle, ImageStyle } from 'react-native' // eslint-disable-line
import { TExtend, getObjectKeys, isUndefined } from 'tsfn'

type TCssProps = TExtend<ImageStyle, TextStyle>

export type TStyle = TExtend<TCssProps, {
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  fontSize?: number,
}>

export const normalizeStyle = (style: TStyle): TCssProps =>
  getObjectKeys(style).reduce((result, key) => {
    const value = style[key]

    if (key === 'fontWeight' && !isUndefined(value)) {
      result.fontWeight = String(value) as TCssProps['fontWeight']

      return result
    }

    // FIXME
    // @ts-ignore
    result[key] = value

    return result
  }, {} as TCssProps)
