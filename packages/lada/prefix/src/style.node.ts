import { CSSProperties } from 'react'
import { TKeyOf } from 'tsfn'

export type TStyle = {
  fontSmoothing?: string,
  tapHighlightColor?: string,
} & CSSProperties
export type TStyleKey = TKeyOf<TStyle>
