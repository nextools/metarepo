import React from 'react'
import { startWithType, pureComponent, mapWithProps, mapHandlers } from 'refun'
import { TRect } from '../../types'
import { Block } from '../block'
import { ButtonIcon, buttonIconSize } from '../button-icon'
import { IconReset, IconTheme, IconStretch, IconGrid, IconInspect } from '../icons'
import { ButtonIconSwitch } from '../button-icon-switch'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { toggleTheme, toggleStretch, toggleGrid, toggleInspect } from '../../actions'
import { mapTheme } from '../themes'
import { WidthField, widthFieldWidth } from './WidthField'
import { HeightField, heightFieldWidth } from './HeightField'
import { ResolutionDropdown, resolutionDropdownHeight, resolutionDropdownWidth } from './ResolutionDropdown'

export type TControls = {
  onResetTransform: () => void,
} & TRect

const SPACER_SIZE = 10
const COMPONENTS_GROUP_WIDTH = resolutionDropdownWidth + widthFieldWidth + heightFieldWidth + buttonIconSize * 5 + SPACER_SIZE * 7
const COMPONENTS_GROUP_HEIGHT = resolutionDropdownHeight

export const Controls = pureComponent(
  startWithType<TControls>(),
  mapTheme(),
  mapStoreState(({ shouldStretch, shouldInspect, hasGrid }) => ({
    isCheckedStretch: shouldStretch,
    isCheckedInspect: shouldInspect,
    isCheckedGrid: hasGrid,
  }), ['shouldStretch', 'shouldInspect', 'hasGrid']),
  mapStoreDispatch,
  mapHandlers({
    onToggleTheme: ({ dispatch }) => () => dispatch(toggleTheme()),
    onToggleStretch: ({ dispatch }) => () => dispatch(toggleStretch()),
    onToggleInspect: ({ dispatch }) => () => dispatch(toggleInspect()),
    onToggleGrid: ({ dispatch }) => () => dispatch(toggleGrid()),
  }),
  mapWithProps(({ theme }) => ({
    iconColor: theme.foreground,
  })),
  mapWithProps(({ width, height }) => ({
    componentsGroupLeft: (width - COMPONENTS_GROUP_WIDTH) / 2,
    componentsGroupTop: (height - COMPONENTS_GROUP_HEIGHT) / 2,
  })),
  mapWithProps(({ componentsGroupLeft }) => {
    const resolutionDropdownLeft = componentsGroupLeft
    const widthFieldLeft = resolutionDropdownLeft + resolutionDropdownWidth + SPACER_SIZE
    const heightFieldLeft = widthFieldLeft + widthFieldWidth + SPACER_SIZE
    const resetTransformButtonLeft = heightFieldLeft + heightFieldWidth + SPACER_SIZE
    const shouldStretchCheckboxLeft = resetTransformButtonLeft + buttonIconSize + SPACER_SIZE
    const shouldInspectCheckboxLeft = shouldStretchCheckboxLeft + buttonIconSize + SPACER_SIZE
    const hasGridCheckboxLeft = shouldInspectCheckboxLeft + buttonIconSize + SPACER_SIZE
    const themeCheckboxLeft = hasGridCheckboxLeft + buttonIconSize + SPACER_SIZE

    return {
      resolutionDropdownLeft,
      widthFieldLeft,
      heightFieldLeft,
      resetTransformButtonLeft,
      shouldStretchCheckboxLeft,
      shouldInspectCheckboxLeft,
      hasGridCheckboxLeft,
      themeCheckboxLeft,
    }
  })
)(({
  width,
  height,
  left,
  top,
  resolutionDropdownLeft,
  widthFieldLeft,
  heightFieldLeft,
  resetTransformButtonLeft,
  shouldStretchCheckboxLeft,
  shouldInspectCheckboxLeft,
  hasGridCheckboxLeft,
  themeCheckboxLeft,
  componentsGroupTop,
  iconColor,
  isDarkTheme,
  isCheckedStretch,
  isCheckedInspect,
  isCheckedGrid,
  onToggleTheme,
  onToggleStretch,
  onToggleInspect,
  onToggleGrid,
  onResetTransform,
}) => (
  <Block width={width} height={height} left={left} top={top}>
    <ResolutionDropdown left={resolutionDropdownLeft} top={componentsGroupTop}/>
    <WidthField left={widthFieldLeft} top={componentsGroupTop}/>
    <HeightField left={heightFieldLeft} top={componentsGroupTop}/>
    <ButtonIcon onPress={onResetTransform} left={resetTransformButtonLeft} top={componentsGroupTop}>
      <IconReset color={iconColor}/>
    </ButtonIcon>
    <ButtonIconSwitch left={shouldStretchCheckboxLeft} top={componentsGroupTop} isChecked={isCheckedStretch} onToggle={onToggleStretch}>
      <IconStretch color={iconColor}/>
    </ButtonIconSwitch>
    <ButtonIconSwitch left={shouldInspectCheckboxLeft} top={componentsGroupTop} isChecked={isCheckedInspect} onToggle={onToggleInspect}>
      <IconInspect color={iconColor}/>
    </ButtonIconSwitch>
    <ButtonIconSwitch left={hasGridCheckboxLeft} top={componentsGroupTop} isChecked={isCheckedGrid} onToggle={onToggleGrid}>
      <IconGrid color={iconColor}/>
    </ButtonIconSwitch>
    <ButtonIconSwitch left={themeCheckboxLeft} top={componentsGroupTop} isChecked={isDarkTheme} onToggle={onToggleTheme}>
      <IconTheme color={iconColor}/>
    </ButtonIconSwitch>
  </Block>
))
