import React from 'react'
import { component, startWithType, mapWithProps } from 'refun'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreState } from '../../store'
import { TRect, TComponents } from '../../types'
import { DemoArea } from '../demo-area'
import { mapTheme } from '../themes'
import { mapImportedComponent } from './map-imported-component'

export type TSandbox = {
  components: TComponents,
  copyImportPackageName?: string,
} & TRect

export const Sandbox = component(
  startWithType<TSandbox>(),
  mapTheme(),
  mapStoreState(({ componentKey, selectedSetIndex }) => ({
    componentKey,
    selectedSetIndex,
  }), ['componentKey', 'selectedSetIndex']),
  mapWithProps(({ theme }) => ({
    backgroundColor: theme.background,
  })),
  mapImportedComponent(),
  mapWithProps(({ left, top, width, height }) => ({
    demoAreaWidth: width,
    demoAreaHeight: height,
    demoAreaLeft: left,
    demoAreaTop: top,
  }))
)(({
  width,
  height,
  demoAreaWidth,
  demoAreaHeight,
  demoAreaLeft,
  demoAreaTop,
  backgroundColor,
  componentProps,
  Component,
}) => (
  <Block width={width} height={height}>
    <Block left={0} top={0} width={width} height={height}>
      <Background color={backgroundColor}/>
    </Block>

    <DemoArea
      width={demoAreaWidth}
      height={demoAreaHeight}
      left={demoAreaLeft}
      top={demoAreaTop}
      Component={Component}
      componentProps={componentProps}
    />
  </Block>
))

Sandbox.displayName = 'Sandbox'
