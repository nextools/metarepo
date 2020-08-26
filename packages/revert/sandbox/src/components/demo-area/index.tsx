import { PrimitiveBlock, Block, PrimitiveBlockRef } from '@revert/block'
import { LayoutContext } from '@revert/layout'
import { Pointer } from '@revert/pointer'
import { PrimitiveTransform } from '@revert/transform'
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
import { isDefined } from 'tsfn'
import { BLACK, WHITE } from '../../colors'
import { mapStoreState, setTransform } from '../../store'
import { mapMetaStoreState } from '../../store-meta/index'
import { SYMBOL_DEMO_AREA } from '../../symbols'
import type { TTransform } from '../../types'
import { isSafari } from '../../utils/platform-id'
import { PrimitiveBackground } from '../background'
import { CanvasGrid } from '../canvas-grid/index'
import { PluginContext } from '../plugin-provider/index'
import { ThemeContext } from '../theme-context'
import { mapInspectRect } from './map-inspect-rect'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {}

export const DemoArea = component(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapContext(PluginContext),
  mapStoreState(({ isCanvasDarkMode, width, height, hasGrid, shouldStretch, shouldInspect, transformX, transformY, transformZ }) => ({
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
    isCanvasDarkMode,
  }), ['isCanvasDarkMode', 'width', 'height', 'hasGrid', 'shouldStretch', 'shouldInspect', 'transformX', 'transformY', 'transformZ']),
  mapMetaStoreState(({ Component, componentProps, componentConfig, componentPropsChildrenMap, selectedElementPath }) => ({
    Component,
    componentProps,
    componentPropsChildrenMap,
    componentConfig,
    selectedElementPath,
  }), ['Component', 'componentProps', 'componentPropsChildrenMap', 'componentConfig', 'selectedElementPath']),
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
  Provider,
  theme,
  isCanvasDarkMode,
  isTransforming,
  onMove,
  onWheel,
}) => (
  <Block shouldHideOverflow>
    <PrimitiveBackground color={theme.demoAreaBackgroundColor}/>
    <Pointer onMove={onMove} onWheel={onWheel}>
      <PrimitiveTransform
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

          {Component !== null && (
            <LayoutContext.Provider
              value={{
                _x: componentLeft,
                _y: componentHeight,
                _left: componentLeft,
                _top: componentTop,
                _width: componentWidth,
                _height: componentHeight,
                _maxWidth: componentWidth,
                _parentLeft: componentLeft,
                _parentTop: componentTop,
                _parentWidth: componentWidth,
                _parentHeight: componentHeight,
                _onHeightChange: setComponentHeight,
              }}
            >
              <PrimitiveBlockRef ref={setBlockNode} shouldFlow>
                {isDefined(Provider)
                  ? (
                    <Provider Component={Component} props={componentProps}/>
                  )
                  : (
                    <PureComponent Component={Component} props={componentProps}/>
                  )}
              </PrimitiveBlockRef>
            </LayoutContext.Provider>
          )}

          {selectedInspectRect !== null && (
            <PrimitiveBlock
              left={selectedInspectRect.left}
              top={selectedInspectRect.top}
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
      </PrimitiveTransform>
    </Pointer>
  </Block>
))

DemoArea.displayName = 'DemoArea'
DemoArea.componentSymbol = SYMBOL_DEMO_AREA
