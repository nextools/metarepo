/* eslint-disable import/no-extraneous-dependencies */
import { TextStyle, ImageStyle } from 'react-native'
import { TKeyOf } from 'tsfn'

export type TStyle = TextStyle | ImageStyle
export type TStyleKey = TKeyOf<TStyle>
