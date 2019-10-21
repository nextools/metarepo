import { FC } from 'react'
import { TComponentConfig } from 'autoprops'
import { TJsonValue } from 'typeon'
import { TExtend } from 'tsfn'
import { TColor } from 'colorido'
import { TResolutionKey } from './resolutions'

export type TApp = {
  components: TComponents,
  theme: TThemes,
  copyImportPackageName?: string,
}

export type TMetaFile = {
  readonly Component: FC<any>,
  readonly config: TComponentConfig,
}

export type TComponents = {
  readonly [k: string]: () => Promise<TMetaFile>,
}

export type TAnyAction = {
  type: string,
  payload?: TJsonValue,
  error?: boolean,
  meta?: TJsonValue,
}

export type TAction<T extends string> = TExtend<TAnyAction, { type: T }>

export type TActionWithPayload<T extends string, P extends TJsonValue> = TExtend<TAnyAction, { type: T, payload: P }>

export type TActionCreator <A extends TAnyAction> = () => A
export type TActionWithPayloadCreator<A extends TAnyAction> = (payload: A['payload']) => A

export type TState = Readonly<{
  width: number,
  height: number,
  hasGrid: boolean,
  shouldStretch: boolean,
  shouldInspect: boolean,
  themeName: TThemeName,
  componentKey: string | null,
  selectedElementPath: string,
  selectedSetIndex: string,
  resolutionKey: TResolutionKey | null,
  isVisibleControls: boolean,
  transform: TTransform,
}>

export type TPosition = {
  readonly left: number,
  readonly top: number,
}

export type TSize = {
  readonly width: number,
  readonly height: number,
}

export type TRect = TSize & TPosition

export type TTransform = {
  readonly x: number,
  readonly y: number,
  readonly z: number,
}

export type TTheme = Readonly<{
  name: TThemeName,
  background: TColor,
  backgroundFocus: TColor,
  border: TColor,
  foreground: TColor,
  foregroundActive: TColor,
  foregroundActiveHover: TColor,
  foregroundActivePressed: TColor,
  foregroundHover: TColor,
  foregroundHoverTransparent: TColor,
  foregroundPressed: TColor,
  foregroundPressedTransparent: TColor,
  foregroundTransparent: TColor,
  iconActive: TColor,
  iconActivePressed: TColor,
  iconIdle: TColor,
  iconIdlePressed: TColor,
  iconTextHover: TColor,
  iconTextPressed: TColor,
  outlineActiveFocus: TColor,
  outlineAlternativeFocus: TColor,
  outlineIdleFocus: TColor,
  sourceAttribute: TColor,
  sourceBaseword: TColor,
  sourceBoolean: TColor,
  sourceComment: TColor,
  sourceFunctionCall: TColor,
  sourceHtmlSyntax: TColor,
  sourceKeyword: TColor,
  sourceNumber: TColor,
  sourceOperator: TColor,
  sourceString: TColor,
  sourceTagName: TColor,
  text: TColor,
  textCaret: TColor,
  textHover: TColor,
  textInverted: TColor,
  textPlaceholder: TColor,
  textPlaceholderHover: TColor,
  textPlaceholderPressed: TColor,
  textPressed: TColor,
}>

export type TThemeName = 'light' | 'dark'

export type TThemes = {
  readonly [k in TThemeName]: TTheme
}
