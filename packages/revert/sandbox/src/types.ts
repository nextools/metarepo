import type { TColor } from '@revert/color'
import type { TCommonComponentConfig } from 'autoprops'
import type { FC } from 'react'
import type { TJsonMap } from 'typeon'
import type { TPopoverPlugin, TComponentPlugin } from './components/plugin-provider/types'
import type { SYMBOL_CONTROL_COLOR, SYMBOL_CONTROL_SWITCH, SYMBOL_CONTROL_DROPDOWN } from './symbols'

export type TApp = {
  components: TComponents,
  theme?: TTheme,
  icons?: TThemeIcons,
  getImportPackageName?: (symbolName: string) => string,
  popoverPlugin?: TPopoverPlugin,
  componentPlugin?: TComponentPlugin,
}

export type TPackageJson = {
  version: string,
  browser?: string,
  'react-native'?: string,
  designDocsUrl?: string,
  sourceCodeUrl?: string,
} & TJsonMap

export type TComponentControlSymbols =
  typeof SYMBOL_CONTROL_COLOR |
  typeof SYMBOL_CONTROL_SWITCH |
  typeof SYMBOL_CONTROL_DROPDOWN

export type TComponentControls<TProps> = {
  [K in keyof TProps]?: TComponentControlSymbols
}

export type TCommonComponentControls = {
  [k: string]: TComponentControlSymbols | undefined,
}

export type TMetaFile = {
  readonly Component: FC<any>,
  readonly config: TCommonComponentConfig,
  readonly controls?: TCommonComponentControls,
  readonly packageJson?: TPackageJson,
  readonly readme?: string,
}

export type TComponents = {
  readonly [k: string]: () => Promise<TMetaFile>,
}

export type TTransform = {
  readonly x: number,
  readonly y: number,
  readonly z: number,
}

export type TId = {
  id?: string,
}

export type TTheme = Readonly<{
  navigationSidebarBackgroundColor: TColor,
  navigationSidebarItemBackgroundColor: TColor,
  navigationSidebarItemColor: TColor,
  navigationSidebarActiveItemBackgroundColor: TColor,
  navigationSidebarActiveItemColor: TColor,
  navigationSidebarPressedItemBackgroundColor: TColor,
  navigationSidebarPressedItemColor: TColor,
  navigationSidebarFocusedItemBackgroundColor: TColor,
  navigationSidebarFocusedItemColor: TColor,
  navigationSidebarHoveredItemBackgroundColor: TColor,
  navigationSidebarHoveredItemColor: TColor,

  searchFieldBackgroundColor: TColor,
  searchFieldPlaceholderColor: TColor,
  searchFieldColor: TColor,
  searchFieldClearIconColor: TColor,
  searchFieldClearIconHoveredColor: TColor,
  searchFieldClearIconPressedColor: TColor,
  searchFieldClearIconFocusedBorderColor: TColor,
  searchFieldSearchIconColor: TColor,
  searchFieldSearchIconActiveColor: TColor,

  controlsColor: TColor,
  controlsPlaceholderColor: TColor,
  controlsIconColor: TColor,
  controlsActionColor: TColor,

  popoverBackgroundColor: TColor,

  tabsColor: TColor,
  tabsActiveColor: TColor,
  tabsActiveBorderColor: TColor,
  tabsDisabledColor: TColor,
  tabsBorderColor: TColor,
  tabsCloseIconColor: TColor,

  fieldColor: TColor,
  fieldPlaceholderColor: TColor,
  fieldBorderColor: TColor,
  fieldFocusedBorderColor: TColor,

  dropdownColor: TColor,
  dropdownChevronColor: TColor,
  dropdownFocusedBorderColor: TColor,

  demoAreaBackgroundColor: TColor,

  controlsSidebarBackgroundColor: TColor,
  controlsSidebarHoveredBackgroundColor: TColor,
  controlsSidebarPressedBackgroundColor: TColor,
  controlsSidebarColor: TColor,
  controlsSidebarIconBackgroundColor: TColor,
  controlsSidebarIconColor: TColor,

  toolbarBackgroundColor: TColor,
  toolbarIconColor: TColor,
  toolbarIconHoveredColor: TColor,
  toolbarIconPressedColor: TColor,
  toolbarIconActiveColor: TColor,
  toolbarIconActiveHoveredColor: TColor,
  toolbarIconActivePressedColor: TColor,
  toolbarIconFocusedBorderColor: TColor,
  toolbarIconActiveFocusedBorderColor: TColor,
  toolbarTextColor: TColor,

  tooltipBackgroundColor: TColor,
  tooltipColor: TColor,

  sourceCodeBaseWordColor: TColor,
  sourceCodeOperatorColor: TColor,
  sourceCodeHtmlSyntaxColor: TColor,
  sourceCodeTagNameColor: TColor,
  sourceCodeAttributeColor: TColor,
  sourceCodeKeywordColor: TColor,
  sourceCodeStringColor: TColor,
  sourceCodeNumberColor: TColor,
  sourceCodeBooleanColor: TColor,
  sourceCodeCommentColor: TColor,
  sourceCodeFunctionCallColor: TColor,

  sourceCodeLineColor: TColor,
  sourceCodeActiveLineColor: TColor,
  sourceCodeLineBackgroundColor: TColor,
  sourceCodeActiveLineBackgroundColor: TColor,
  sourceCodeHoveredLineBackgroundColor: TColor,
  sourceCodeActiveHoveredLineBackgroundColor: TColor,
  sourceCodePressedLineBackgroundColor: TColor,
  sourceCodeActivePressedLineBackgroundColor: TColor,
  sourceCodeCollapseIconColor: TColor,
  sourceCodeCollapseIconHoveredColor: TColor,
  sourceCodeCollapseIconPressedColor: TColor,
  sourceCodeCollapseIconFocusedBorderColor: TColor,

  linkColor: TColor,

  switchBackgroundColor: TColor,
  switchActiveBackgroundColor: TColor,
  switchKnobBackgroundColor: TColor,
  switchFocusedBorderColor: TColor,
  switchActiveFocusedBorderColor: TColor,

  checkmarkBackgroundColor: TColor,
  checkmarkActiveBackgroundColor: TColor,
  checkmarkDisabledBackgroundColor: TColor,
  checkmarkActiveDisabledBackgroundColor: TColor,
  checkmarkBorderColor: TColor,
  checkmarkActiveBorderColor: TColor,
  checkmarkDisabledBorderColor: TColor,
  checkmarkActiveDisabledBorderColor: TColor,
  checkmarkIconColor: TColor,

  notificationBackgroundColor: TColor,
  notificationColor: TColor,
  notificationCloseColor: TColor,

  alertBackgroundColor: TColor,
  alertColor: TColor,
  alertIconColor: TColor,
  alertCloseColor: TColor,

  inspectBackgroundColor: TColor,

  sandboxBorderColor: TColor,
  sandboxBorderHoveredColor: TColor,
  sandboxBorderPressedColor: TColor,

  mdCodeColor: TColor,
  mdCodeBackgroundColor: TColor,
  mdCodespanColor: TColor,
  mdHrColor: TColor,
  mdBlockquoteBorderColor: TColor,
  mdTableBorderColor: TColor,
}>

export type TThemeIcons = Readonly<{
  canvas: string,
  checkmarkSmall: string,
  closeSmall: string,
  copySource: string,
  copyUrl: string,
  darkMode: string,
  dropdownChevronSmall: string,
  grid: string,
  inspect: string,
  panelCollapseRight: string,
  resetTransform: string,
  screen: string,
  searchSmall: string,
  sourceCollapseArrowDownSmall: string,
  stretch: string,
  theme: string,
  tooltipArrowDown: string,
}>
