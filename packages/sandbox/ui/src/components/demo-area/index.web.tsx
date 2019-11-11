import React, { FC } from 'react'
import {
  mapWithProps,
  startWithType,
  mapDebouncedHandlerTimeout,
  pureComponent,
  mapState,
  mapHandlers,
  mapWithPropsMemo,
} from 'refun'
import { Pointer } from '@primitives/pointer'
import { Transform } from '@primitives/transform'
import { Size } from '@primitives/size'
import { TAnyObject } from 'tsfn'
import { TComponentConfig } from 'autoprops'
import { Border } from '../border'
import { Shadow } from '../shadow'
import { Background } from '../background'
import { Block } from '../block'
import { BlockRef } from '../block-ref'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { isSafari } from '../../utils/platform-id'
import { Grid } from '../grid'
import { Controls } from '../controls'
import { TRect, TTransform } from '../../types'
import { setTransform } from '../../actions'
import { mapTheme } from '../themes'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'
import { mapInspectRect } from './map-inspect-rect'

const CONTROLS_HEIGHT = 60
const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {
  Component?: FC<any>,
  componentProps?: Readonly<TAnyObject>,
  componentPropsChildrenMap?: Readonly<TAnyObject>,
  componentConfig?: TComponentConfig,
} & TRect

export const DemoArea = pureComponent(
  startWithType<TDemoArea>(),
  mapTheme(),
  mapStoreState(({ width, height, hasGrid, shouldStretch, shouldInspect, transform, selectedElementPath }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    shouldInspect,
    hasGrid,
    transform,
    selectedElementPath,
  }), ['width', 'height', 'hasGrid', 'shouldStretch', 'shouldInspect', 'transform', 'selectedElementPath']),
  mapStoreDispatch,
  mapHandlers({
    dispatchTransform: ({ dispatch }) => (transform: TTransform) => dispatch(setTransform(transform)),
  }),
  mapDebouncedHandlerTimeout('dispatchTransform', 150),
  mapWithProps(({ theme }) => ({
    backgroundColor: theme.background,
    borderColor: theme.border,
    shadowColor: theme.border,
  })),
  mapWithProps(({ canvasWidth, canvasHeight, width, height }) => ({
    canvasLeft: Math.max((width - canvasWidth) / 2, 0),
    canvasTop: Math.max((height - canvasHeight - CONTROLS_HEIGHT) / 2, 0),
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
  mapTransform(0, CONTROLS_HEIGHT)
)(({
  left,
  top,
  width,
  height,
  canvasWidth,
  canvasHeight,
  canvasLeft,
  canvasTop,
  Component,
  componentProps,
  hasGrid,
  transform,
  isTransforming,
  componentWidth,
  componentLeft,
  componentTop,
  componentHeight,
  setComponentHeight,
  backgroundColor,
  borderColor,
  shadowColor,
  selectedInspectRect,
  setBlockNode,
  isDarkTheme,
  onMove,
  onReset,
  onWheel,
}) => (
  <Block width={width} height={height} left={left} top={top}>
    <Controls
      width={width}
      height={CONTROLS_HEIGHT}
      left={left}
      top={top}
      onResetTransform={onReset}
    />
    <Block width={width} height={1} left={left} top={CONTROLS_HEIGHT - 1}>
      <Background color={borderColor}/>
    </Block>

    <Block left={0} top={CONTROLS_HEIGHT} width={width} height={height - CONTROLS_HEIGHT} shouldHideOverflow>
      <Pointer onMove={onMove} onWheel={onWheel}>
        <Transform
          x={canvasLeft + transform.x}
          y={canvasTop + transform.y}
          scale={transform.z}
          shouldUse3d={!isSafari}
        >
          <Block
            shouldFlow
            width={canvasWidth}
            height={canvasHeight}
          >
            <Block top={0} left={0} width={canvasWidth} height={canvasHeight}>
              <Background color={backgroundColor}/>
              {!isTransforming && <Shadow color={shadowColor} blurRadius={10} spreadRadius={1}/>}
              {isTransforming && <Border color={shadowColor} topWidth={1} bottomWidth={1} leftWidth={1} rightWidth={1}/>}
            </Block>

            {Component && (
              <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d={!isSafari}>
                <Size
                  height={componentHeight}
                  onHeightChange={setComponentHeight}
                >
                  <BlockRef
                    ref={setBlockNode}
                    width={componentWidth}
                    shouldFlow
                  >
                    <PureComponent Component={Component} props={componentProps}/>
                  </BlockRef>
                </Size>
              </Transform>
            )}

            {selectedInspectRect !== null && (
              <Block
                left={selectedInspectRect.left + componentLeft}
                top={selectedInspectRect.top + componentTop}
                width={selectedInspectRect.width}
                height={selectedInspectRect.height}
                shouldIgnorePointerEvents
              >
                <Background color={[255, 0, 0, 0.3]}/>
              </Block>
            )}

            {hasGrid && (
              <Grid
                width={canvasWidth}
                height={canvasHeight}
                shouldDegrade={isTransforming}
                isDarkTheme={isDarkTheme}
              />
            )}
          </Block>
        </Transform>
      </Pointer>
    </Block>
  </Block>
))

DemoArea.displayName = 'DemoArea'
