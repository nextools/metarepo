import React, { FC } from 'react'
import { serializeComponent } from 'syntx'
import { startWithType, pureComponent, mapWithPropsMemo, mapHandlers } from 'refun'
import { TAnyObject } from 'tsfn'
import { TComponentConfig } from 'autoprops'
import { Block } from '../block'
import { mapStoreState } from '../../store'
import { TRect } from '../../types'
import { ButtonIcon, buttonIconSize } from '../button-icon'
import { IconCopy } from '../icons'
import { SPACER_SIZE } from '../component-controls/calculate-size'
import { mapTheme } from '../themes'
import { LinesBlock } from './LinesBlock'
import { serializeComponentToText } from './serialize-component-to-text'
import { createChildrenMeta } from './create-children-meta'

export type TSourceCode = {
  Component: FC<any>,
  componentConfig: TComponentConfig,
  componentProps: Readonly<TAnyObject>,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  copyImportPackageName?: string,
} & TRect

export const SourceCode = pureComponent(
  startWithType<TSourceCode>(),
  mapTheme(),
  mapStoreState(({ selectedSetIndex, selectedElementPath }) => ({
    selectedSetIndex,
    selectedElementPath,
  }), ['selectedSetIndex', 'selectedElementPath']),
  mapWithPropsMemo(({ Component, componentConfig, componentProps, componentPropsChildrenMap }) => ({
    lines: serializeComponent(Component, componentProps, {
      indent: 2,
      meta: createChildrenMeta(componentConfig, componentPropsChildrenMap),
    }),
  }), ['Component', 'componentProps', 'componentPropsChildrenMap']),
  mapHandlers({
    onCopy: ({ Component, componentProps, copyImportPackageName }) => () => {
      navigator.clipboard.writeText(
        serializeComponentToText(Component, componentProps, copyImportPackageName)
      )
    },
  })
)(({
  theme,
  width,
  height,
  left,
  top,
  lines,
  selectedElementPath,
  onCopy,
}) => (
  <Block width={width} height={height} left={left} top={top}>
    <Block
      width={width}
      height={height - 20}
      left={0}
      top={10}
      shouldScroll
      shouldForceAcceleration
    >
      <LinesBlock
        width={width}
        lines={lines}
        theme={theme}
        selectedElementPath={selectedElementPath}
      />
    </Block>

    <ButtonIcon
      left={width - buttonIconSize - SPACER_SIZE}
      top={10}
      isInverted
      onPress={onCopy}
    >
      <IconCopy color={theme.foreground}/>
    </ButtonIcon>

  </Block>
))

SourceCode.displayName = 'SourceCode'
