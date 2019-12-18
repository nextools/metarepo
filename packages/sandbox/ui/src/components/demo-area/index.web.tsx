import React from 'react'
import {
  mapWithProps,
  startWithType,
  mapDebouncedHandlerTimeout,
  mapState,
  mapHandlers,
  mapWithPropsMemo,
  mapContext,
  component,
} from 'refun'
import { Pointer } from '@primitives/pointer'
import { Transform } from '@primitives/transform'
import { isDefined } from 'tsfn'
import { PrimitiveBackground } from '../primitive-background'
import { PrimitiveBlock } from '../primitive-block'
import { PrimitiveBlockRef } from '../primitive-block-ref'
import { mapStoreState, setTransform } from '../../store'
import { isSafari } from '../../utils/platform-id'
import { CanvasGrid } from '../canvas-grid'
import { TTransform } from '../../types'
import { ThemeContext } from '../theme-context'
import { LayoutContext } from '../layout-context'
import { SYMBOL_DEMO_AREA } from '../../symbols'
import { SizeBlock } from '../size-block'
import { BLACK, WHITE } from '../../colors'
import { mapMetaStoreState } from '../../store-meta'
import { PluginContext } from '../plugin-provider'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'
import { mapInspectRect } from './map-inspect-rect'
import { Size } from './Size'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {}

export const DemoArea = component(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapContext(PluginContext),
  mapStoreState(({ isCanvasDarkMode, width, height, hasGrid, shouldStretch, shouldInspect, transformX, transformY, transformZ, selectedElementPath }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    shouldInspect,
    hasGrid,
    transform: {
      x: transformX,
      y: transformY,
      z: transformZ,
    },
    selectedElementPath,
    isCanvasDarkMode,
  }), ['isCanvasDarkMode', 'width', 'height', 'hasGrid', 'shouldStretch', 'shouldInspect', 'transformX', 'transformY', 'transformZ', 'selectedElementPath']),
  mapMetaStoreState(({ Component, componentProps, componentConfig, componentPropsChildrenMap }) => ({
    Component,
    componentProps,
    componentPropsChildrenMap,
    componentConfig,
  }), ['Component', 'componentProps', 'componentPropsChildrenMap', 'componentConfig']),
  mapHandlers({
    dispatchTransform: () => (transform: TTransform) => setTransform(transform),
  }),
  mapDebouncedHandlerTimeout('dispatchTransform', 150),
  mapWithProps(({ canvasWidth, canvasHeight, _width, _height }) => ({
    canvasLeft: Math.max((_width - canvasWidth) / 2, 0),
    canvasTop: Math.max((_height - canvasHeight) / 2, 0),
  })),
  mapState('componentHeight', 'setComponentHeight', () => 0, []),
  mapWithPropsMemo(({ componentHeight, canvasWidth, canvasHeight, shouldStretch }) => {
    const componentWidth = shouldStretch ? canvasWidth : COMPONENT_MIN_WIDTH

    if (componentHeight === 0) {
      return {
        componentLeft: 0,
        componentTop: 0,
        componentWidth,
      }
    }

    return {
      componentLeft: shouldStretch ? 0 : round10((canvasWidth - componentWidth) / 2),
      componentTop: round10((canvasHeight - componentHeight) / 2),
      componentWidth,
    }
  }, ['componentHeight', 'shouldStretch', 'canvasWidth', 'canvasHeight']),
  mapInspectRect(),
  mapTransform
)(({
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  Component,
  componentProps,
  hasGrid,
  transform,
  componentWidth,
  componentLeft,
  componentTop,
  componentHeight,
  setComponentHeight,
  selectedInspectRect,
  setBlockNode,
  plugin,
  theme,
  isCanvasDarkMode,
  isTransforming,
  onMove,
  onWheel,
}) => (
  <SizeBlock shouldHideOverflow>
    <PrimitiveBackground color={theme.demoAreaBackgroundColor}/>
    <Pointer onMove={onMove} onWheel={onWheel}>
      <Transform
        x={canvasLeft + transform.x}
        y={canvasTop + transform.y}
        scale={transform.z}
        shouldUse3d={!isSafari}
      >
        <PrimitiveBlock
          width={canvasWidth}
          height={canvasHeight}
          shouldFlow
        >
          <PrimitiveBackground color={isCanvasDarkMode ? BLACK : WHITE}/>

          {Component && (
            <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d={!isSafari}>
              <Size
                height={componentHeight}
                onHeightChange={setComponentHeight}
              >
                <PrimitiveBlockRef
                  ref={setBlockNode}
                  width={componentWidth}
                  shouldFlow
                >
                  {isDefined(plugin)
                    ? (
                      <plugin.Provider Component={Component} props={componentProps}/>
                    )
                    : (
                      <PureComponent Component={Component} props={componentProps}/>
                    )}
                </PrimitiveBlockRef>
              </Size>
            </Transform>
          )}

          {selectedInspectRect !== null && (
            <PrimitiveBlock
              left={selectedInspectRect.left + componentLeft}
              top={selectedInspectRect.top + componentTop}
              width={selectedInspectRect.width}
              height={selectedInspectRect.height}
              shouldIgnorePointerEvents
            >
              <PrimitiveBackground color={theme.inspectBackgroundColor}/>
            </PrimitiveBlock>
          )}

          {hasGrid && (
            <CanvasGrid
              width={canvasWidth}
              height={canvasHeight}
              shouldDegrade={isTransforming}
              isCanvasDarkMode={isCanvasDarkMode}
            />
          )}
        </PrimitiveBlock>
      </Transform>
    </Pointer>
  </SizeBlock>
))

DemoArea.displayName = 'DemoArea'
DemoArea.componentSymbol = SYMBOL_DEMO_AREA
