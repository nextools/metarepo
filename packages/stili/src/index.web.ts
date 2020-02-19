import { CSSProperties } from 'react' // eslint-disable-line
import { getObjectKeys, TExtend } from 'tsfn'

export type TStyle = TExtend<CSSProperties, {
  fontSmoothing?: string,
  tapHighlightColor?: string,
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900,
  fontSize?: number,
}>

type TCssProps = TExtend<CSSProperties, {
  WebkitFontSmoothing?: string,
}>

export const normalizeStyle = (style: TStyle): TCssProps =>
  getObjectKeys(style).reduce((result, key) => {
    const value = style[key]

    if (key === 'userSelect') {
      result.WebkitUserSelect = value as TCssProps['WebkitUserSelect']
      result.MozUserSelect = value as TCssProps['MozUserSelect']
      result.msUserSelect = value as TCssProps['msUserSelect']
      result.userSelect = value as TCssProps['userSelect']

      return result
    }

    if (key === 'tapHighlightColor') {
      result.WebkitTapHighlightColor = value as TCssProps['WebkitTapHighlightColor']

      return result
    }

    if (key === 'fontSmoothing') {
      result.WebkitFontSmoothing = value as TCssProps['WebkitFontSmoothing']

      return result
    }

    if (key === 'appearance') {
      result.WebkitAppearance = value as TCssProps['WebkitAppearance']
      result.MozAppearance = value as TCssProps['MozAppearance']
      result.appearance = value as TCssProps['appearance']

      return result
    }

    // FIXME
    // @ts-ignore
    result[key as keyof TCssProps] = value

    return result
  }, {} as TCssProps)
