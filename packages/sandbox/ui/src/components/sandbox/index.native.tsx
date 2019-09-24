import React from 'react'
import { component, startWithType, mapWithProps, mapContext } from 'refun'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreState } from '../../store'
import { TRect, TComponents } from '../../types'
import { DemoArea } from '../demo-area'
import { mapImportedComponent } from '../../utils/map-imported-component'
import { ThemeContext } from '../themes'

export type TSandbox = { components: TComponents } & TRect

export const Sandbox = component(
  startWithType<TSandbox>(),
  mapContext(ThemeContext),
  mapStoreState(({ themeName, componentKey, selectedSetIndex }) => ({
    themeName,
    componentKey,
    selectedSetIndex,
  }), ['themeName', 'componentKey', 'selectedSetIndex']),
  mapWithProps(({ theme, themeName }) => {
    const selectedTheme = theme[themeName]

    return {
      backgroundColor: selectedTheme.background,
    }
  }),
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
  componentMetaFile,
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
      Component={componentMetaFile && componentMetaFile.Component}
      componentProps={componentProps}
    />
  </Block>
))

Sandbox.displayName = 'Sandbox'
