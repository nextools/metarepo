import React from 'react'
import { applyPropValue, TComponentConfig } from 'autoprops'
import { mapWithProps, startWithType, pureComponent, mapHandlers, mapDebouncedHandlerTimeout } from 'refun'
import { TAnyObject } from 'tsfn'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { setComponent, setSelectedSetIndex } from '../../actions'
import { Block } from '../block'
import { TRect } from '../../types'
import { mapTheme } from '../themes'
import { mapChildConfigByPath } from './map-child-config-by-path'
import { getPropsBlockHeight } from './calculate-size'
import { PropsBlock } from './PropsBlock'

export type TComponentControls = {
  componentName: string,
  componentConfig: TComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
} & TRect

export const ComponentControls = pureComponent(
  startWithType<TComponentControls>(),
  mapTheme(),
  mapStoreState(({ componentKey, selectedSetIndex, selectedElementPath }) => ({
    componentKey,
    selectedSetIndex,
    selectedElementPath,
  }), ['componentKey', 'selectedSetIndex', 'selectedElementPath']),
  mapStoreDispatch,
  mapHandlers({
    onChangeComponentName: ({ dispatch }) => (value: string | null) => dispatch(setComponent(value)),
    onChangePropsSetIndex: ({ dispatch }) => (value: string) => dispatch(setSelectedSetIndex(value)),
  }),
  mapHandlers({
    onChange: ({ componentConfig, selectedSetIndex, onChangePropsSetIndex }) => (propPath, propValue) =>
      onChangePropsSetIndex(
        applyPropValue(componentConfig, selectedSetIndex, propPath, propValue)
      ),
  }),
  mapDebouncedHandlerTimeout('onChange', 50),
  mapChildConfigByPath(),
  mapWithProps(({ childConfig }) => ({
    totalHeight: getPropsBlockHeight(childConfig),
  }))
)(({
  childDisplayName,
  childPropsChildrenMap,
  childConfig,
  childPath,
  width,
  height,
  top,
  left,
  totalHeight,
  theme,
  onChange,
}) => (
  <Block width={width} height={height} left={left} top={top} shouldScroll>
    <Block shouldFlow height={totalHeight}/>
    <PropsBlock
      left={0}
      top={0}
      width={width}
      componentName={childDisplayName}
      componentConfig={childConfig}
      componentPropsChildrenMap={childPropsChildrenMap}
      propPath={childPath}
      theme={theme}
      onChange={onChange}
    />
  </Block>
))
