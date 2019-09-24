import React, { FC } from 'react'
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
import { Size } from '@primitives/size'
import { TAnyObject } from 'tsfn'
import { Border } from '../border'
import { Shadow } from '../shadow'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { Grid } from '../grid'
import { TRect, TTransform } from '../../types'
import { setTransform } from '../../actions'
import { ThemeContext } from '../themes'
import { mapTransform } from './map-transform'
import { PureComponent } from './pure-component'

const COMPONENT_MIN_WIDTH = 200
const round10 = (num: number) => Math.round(num / 10) * 10

export type TDemoArea = {
  Component?: FC<any>,
  componentProps?: TAnyObject,
} & TRect

export const DemoArea = pureComponent(
  startWithType<TDemoArea>(),
  mapContext(ThemeContext),
  mapStoreState(({ width, height, hasGrid, shouldStretch, transform, themeName }) => ({
    canvasWidth: width,
    canvasHeight: height,
    shouldStretch,
    hasGrid,
    transform,
    themeName,
  }), ['width', 'height', 'hasGrid', 'shouldStretch', 'transform', 'themeName']),
  mapStoreDispatch,
  mapHandlers({
    dispatchTransform: ({ dispatch }) => (transform: TTransform) => dispatch(setTransform(transform)),
  }),
  mapDebouncedHandlerTimeout('dispatchTransform', 150),
  mapWithProps(({ theme, themeName }) => {
    const selectedTheme = theme[themeName]

    return {
      backgroundColor: selectedTheme.background,
      borderColor: selectedTheme.border,
      shadowColor: selectedTheme.border,
    }
  }),
  mapWithProps(({ canvasWidth, canvasHeight, width, height }) => ({
    canvasLeft: Math.max((width - canvasWidth) / 2, 0),
    canvasTop: Math.max((height - canvasHeight) / 2, 0),
  })),
  mapState('componentHeight', 'setComponentHeight', () => 0, []),
  mapWithPropsMemo(({ componentHeight, canvasWidth, canvasHeight, shouldStretch }) => {
    if (componentHeight === 0) {
      return {
        componentLeft: 0,
        componentTop: 0,
        componentWidth: COMPONENT_MIN_WIDTH,
      }
    }

    const componentWidth = shouldStretch ? canvasWidth : COMPONENT_MIN_WIDTH

    return {
      componentLeft: shouldStretch ? 0 : round10((canvasWidth - componentWidth) / 2),
      componentTop: round10((canvasHeight - componentHeight) / 2),
      componentWidth,
    }
  }, ['componentHeight', 'shouldStretch', 'canvasWidth', 'canvasHeight']),
  mapTransform(0, 0)
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
  shadowColor,
  themeName,
}) => (
  <Block width={width} height={height} left={left} top={top} shouldHideOverflow>
    <Transform
      shouldUse3d
      x={canvasLeft + transform.x}
      y={canvasTop + transform.y}
      scale={transform.z}
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
          <Block width={componentWidth}>
            <Transform x={componentLeft} y={componentTop} hOrigin="left" vOrigin="top" shouldUse3d>
              <Size
                height={componentHeight}
                valuesToWatch={[componentWidth, componentProps, canvasWidth, canvasHeight]}
                onHeightChange={setComponentHeight}
              >
                <PureComponent Component={Component} props={componentProps}/>
              </Size>
            </Transform>
          </Block>
        )}

        {hasGrid && (
          <Grid width={canvasWidth} height={canvasHeight} shouldDegrade={isTransforming} themeName={themeName}/>
        )}
      </Block>
    </Transform>
  </Block>
))

DemoArea.displayName = 'DemoArea'
