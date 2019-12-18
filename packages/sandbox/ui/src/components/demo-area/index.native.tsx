import React from 'react'
import {
  mapWithProps,
  startWithType,
  mapDebouncedHandlerTimeout,
  pureComponent,
  mapState,
  mapHandlers,
  mapWithPropsMemo,
  mapContext,
} from 'refun'
import { Transform } from '@primitives/transform'
import { Size } from '../size'
import { PrimitiveBackground } from '../primitive-background'
import { PrimitiveBlock } from '../primitive-block'
import { mapStoreState, setTransform } from '../../store'
import { CanvasGrid } from '../canvas-grid'
import { TTransform } from '../../types'
import { LayoutContext } from '../layout-context'
import { ThemeContext } from '../theme-context'
import { SizeBlock } from '../size-block'
import { BLACK, WHITE } from '../../colors'
import { mapMetaStoreState } from '../../store-meta'
import { SYMBOL_DEMO_AREA } from '../../symbols'
import { PureComponent } from './pure-component'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {}

export const DemoArea = pureComponent(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapContext(LayoutContext),
  mapStoreState(({ width, height, hasGrid, shouldStretch, isCanvasDarkMode, transformX, transformY, transformZ }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    hasGrid,
    isCanvasDarkMode,
    transform: {
      x: transformX,
      y: transformY,
      z: transformZ,
    },
  }), ['width', 'height', 'hasGrid', 'shouldStretch', 'isCanvasDarkMode', 'transformX', 'transformY', 'transformZ']),
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
        componentWidth: COMPONENT_MIN_WIDTH,
      }
    }

    return {
      componentLeft: shouldStretch ? 0 : round10((canvasWidth - componentWidth) / 2),
      componentTop: round10((canvasHeight - componentHeight) / 2),
      componentWidth,
    }
  }, ['componentHeight', 'shouldStretch', 'canvasWidth', 'canvasHeight'])
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
  theme,
  isCanvasDarkMode,
}) => (
  <SizeBlock shouldHideOverflow>
    <PrimitiveBackground color={theme.demoAreaBackgroundColor}/>
    <Transform
      shouldUse3d
      x={canvasLeft + transform.x}
      y={canvasTop + transform.y}
      scale={transform.z}
    >
      <PrimitiveBlock
        shouldFlow
        width={canvasWidth}
        height={canvasHeight}
      >
        <PrimitiveBackground color={isCanvasDarkMode ? BLACK : WHITE}/>

        {Component && (
          <PrimitiveBlock width={componentWidth}>
            <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d>
              <Size
                height={componentHeight}
                onHeightChange={setComponentHeight}
              >
                <PureComponent Component={Component} props={componentProps}/>
              </Size>
            </Transform>
          </PrimitiveBlock>
        )}

        {hasGrid && (
          <CanvasGrid
            width={canvasWidth}
            height={canvasHeight}
            shouldDegrade={false}
            isCanvasDarkMode={isCanvasDarkMode}
          />
        )}
      </PrimitiveBlock>
    </Transform>
  </SizeBlock>
))

DemoArea.displayName = 'DemoArea'
DemoArea.componentSymbol = SYMBOL_DEMO_AREA
