import React, { Fragment } from 'react'
import { component, startWithType, mapWithProps, mapHandlers } from 'refun'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { TRect, TComponents } from '../../types'
import { DemoArea } from '../demo-area'
import { SourceCode } from '../source-code'
import { ComponentControls } from '../component-controls'
import { toggleControls } from '../../actions'
import { buttonIconSize, buttonIconSizeOverflow, ButtonIcon } from '../button-icon'
import { IconChevronRight, IconChevronLeft } from '../icons'
import { ComponentSelect } from '../component-select'
import { mapTheme } from '../themes'
import { getComponentName } from '../../utils'
import { mapImportedComponent } from './map-imported-component'

const CONTROLS_WIDTH = 500
const TOP_BAR_HEIGHT = 60

export type TSandbox = {
  components: TComponents,
  copyImportPackageName?: string,
} & TRect

export const Sandbox = component(
  startWithType<TSandbox>(),
  mapTheme(),
  mapStoreState(({ isVisibleControls, componentKey, selectedSetIndex }) => ({
    isVisibleControls,
    componentKey,
    selectedSetIndex,
  }), ['isVisibleControls', 'componentKey', 'selectedSetIndex']),
  mapStoreDispatch,
  mapHandlers({
    onToggleControls: ({ dispatch }) => () => dispatch(toggleControls()),
  }),
  mapWithProps(({ theme }) => ({
    backgroundColor: theme.background,
    borderColor: theme.border,
    textColor: theme.text,
  })),
  mapImportedComponent(),
  mapWithProps(({ left, top, width, height, isVisibleControls }) => ({
    sidebarTop: top,
    sidebarLeft: width - CONTROLS_WIDTH,
    sidebarWidth: CONTROLS_WIDTH,
    sidebarHeight: height,
    demoAreaTop: top,
    demoAreaLeft: left,
    demoAreaWidth: isVisibleControls ? width - CONTROLS_WIDTH : width,
    demoAreaHeight: height,
    componentSelectTop: top,
    componentSelectHeight: TOP_BAR_HEIGHT,
  })),
  mapWithProps(({ componentSelectTop, componentSelectHeight, height }) => ({
    sourceCodeTop: componentSelectTop + componentSelectHeight,
    sourceCodeHeight: (height - componentSelectHeight) / 2,
  })),
  mapWithProps(({ sourceCodeTop, sourceCodeHeight }) => ({
    controlsTop: sourceCodeTop + sourceCodeHeight,
    controlsHeight: sourceCodeHeight,
  })),
  mapWithProps(({ isVisibleControls, demoAreaWidth, controlsTop }) => ({
    controlsToggleLeft: isVisibleControls ? demoAreaWidth - buttonIconSize / 2 : demoAreaWidth - buttonIconSizeOverflow,
    controlsToggleTop: controlsTop - buttonIconSize / 2,
  }))
)(({
  width,
  height,
  demoAreaWidth,
  demoAreaHeight,
  demoAreaLeft,
  demoAreaTop,
  sourceCodeHeight,
  sourceCodeTop,
  sidebarWidth,
  controlsHeight,
  controlsTop,
  sidebarLeft,
  sidebarHeight,
  sidebarTop,
  controlsToggleTop,
  controlsToggleLeft,
  componentSelectTop,
  componentSelectHeight,
  copyImportPackageName,
  isVisibleControls,
  textColor,
  borderColor,
  backgroundColor,
  components,
  Component,
  componentConfig,
  componentProps,
  componentPropsChildrenMap,
  onToggleControls,
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
      componentPropsChildrenMap={componentPropsChildrenMap}
      componentConfig={componentConfig}
    />

    {isVisibleControls && (
      <Fragment>
        <ComponentSelect
          components={components}
          top={componentSelectTop}
          left={sidebarLeft}
          width={sidebarWidth}
          height={componentSelectHeight}
        />

        {Component && componentConfig && componentProps && componentPropsChildrenMap && (
          <Fragment>
            <SourceCode
              width={sidebarWidth}
              height={sourceCodeHeight}
              left={sidebarLeft}
              top={sourceCodeTop}
              Component={Component}
              componentConfig={componentConfig}
              componentProps={componentProps}
              componentPropsChildrenMap={componentPropsChildrenMap}
              copyImportPackageName={copyImportPackageName}
            />

            <ComponentControls
              width={sidebarWidth}
              height={controlsHeight}
              left={sidebarLeft}
              top={controlsTop}
              componentPropsChildrenMap={componentPropsChildrenMap}
              componentName={getComponentName(Component)}
              componentConfig={componentConfig}
            />
          </Fragment>
        )}

        <Block
          width={sidebarWidth}
          height={1}
          left={sidebarLeft}
          top={sourceCodeTop - 1}
        >
          <Background color={borderColor}/>
        </Block>

        <Block
          width={sidebarWidth}
          height={1}
          left={sidebarLeft}
          top={controlsTop}
        >
          <Background color={borderColor}/>
        </Block>

        <Block
          width={1}
          height={sidebarHeight}
          left={sidebarLeft}
          top={sidebarTop}
        >
          <Background color={borderColor}/>
        </Block>
      </Fragment>
    )}

    <ButtonIcon onPress={onToggleControls} left={controlsToggleLeft} top={controlsToggleTop}>
      {isVisibleControls ? <IconChevronRight color={textColor}/> : <IconChevronLeft color={textColor}/>}
    </ButtonIcon>
  </Block>
))

Sandbox.displayName = 'Sandbox'
