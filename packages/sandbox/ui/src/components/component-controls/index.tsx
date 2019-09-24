import React from 'react'
import { TMetaFile, applyPropValue } from 'autoprops'
import { mapWithProps, startWithType, pureComponent, mapHandlers, mapDebouncedHandlerTimeout } from 'refun'
import { isUndefined, TAnyObject } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setComponent, setSelectedSetIndex } from '../../actions'
import { Block } from '../block'
import { TRect } from '../../types'
import { getMetaByPath } from '../../utils'
import { SPACER_SIZE, getPropsBlockHeight, TITLE_HEIGHT } from './calculate-size'
import { PropsBlock } from './PropsBlock'

export type TComponentControls = {
  componentMetaFile?: TMetaFile,
  componentPropsChildrenMap?: TAnyObject,
} & TRect

export const ComponentControls = pureComponent(
  startWithType<TComponentControls>(),
  mapStoreState(({ componentKey, selectedSetIndex, selectedElementPath, themeName }) => ({
    themeName,
    componentKey,
    selectedSetIndex,
    selectedElementPath,
  }), ['componentKey', 'selectedSetIndex', 'selectedElementPath', 'themeName']),
  mapStoreDispatch,
  mapHandlers({
    onChangeComponentName: ({ dispatch }) => (value: string | null) => dispatch(setComponent(value)),
    onChangePropsSetIndex: ({ dispatch }) => (value: string) => dispatch(setSelectedSetIndex(value)),
  }),
  mapHandlers({
    onChange: ({ componentMetaFile, selectedSetIndex, onChangePropsSetIndex }) => (propPath, propValue) => {
      if (!isUndefined(componentMetaFile)) {
        return onChangePropsSetIndex(applyPropValue(selectedSetIndex, componentMetaFile, propPath, propValue))
      }
    },
  }),
  mapDebouncedHandlerTimeout('onChange', 50),
  mapWithProps(({ componentMetaFile, componentPropsChildrenMap, selectedElementPath }) => {
    if (isUndefined(componentMetaFile) || isUndefined(componentPropsChildrenMap)) {
      return {
        componentMetaFile: undefined,
        componentProps: undefined,
        propPath: [] as string[],
      }
    }

    return getMetaByPath(componentMetaFile, componentPropsChildrenMap, selectedElementPath)
  }),
  mapWithProps(({ componentMetaFile }) => {
    if (!isUndefined(componentMetaFile)) {
      return {
        totalHeight: getPropsBlockHeight(componentMetaFile) - TITLE_HEIGHT,
      }
    }

    return {
      totalHeight: 0,
    }
  })
)(({
  componentProps,
  componentMetaFile,
  width,
  height,
  top,
  left,
  totalHeight,
  themeName,
  propPath,
  onChange,
}) => (
  <Block width={width} height={height} left={left} top={top} shouldScroll>
    <Block shouldFlow height={totalHeight + SPACER_SIZE}/>

    {componentMetaFile && componentProps && (
      <PropsBlock
        left={0}
        top={0}
        width={width}
        componentMetaFile={componentMetaFile}
        componentProps={componentProps}
        propPath={propPath}
        themeName={themeName}
        onChange={onChange}
      />
    )}
  </Block>
))
