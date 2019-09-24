import React from 'react'
import { serializeComponent } from 'syntx'
import { startWithType, pureComponent, mapWithPropsMemo, mapHandlers, mapContext } from 'refun'
import { TAnyObject, isUndefined } from 'tsfn'
import { TMetaFile } from 'autoprops'
import { Block } from '../block'
import { mapStoreState } from '../../store'
import { TRect } from '../../types'
import { ButtonIcon, buttonIconSize } from '../button-icon'
import { IconCopy } from '../icons'
import { SPACER_SIZE } from '../component-controls/calculate-size'
import { ThemeContext } from '../themes'
import { Root } from './Root'

export type TSourceCode = {
  componentProps?: TAnyObject,
  componentMetaFile?: TMetaFile,
} & TRect

export const SourceCode = pureComponent(
  startWithType<TSourceCode>(),
  mapContext(ThemeContext),
  mapStoreState(({ themeName, selectedSetIndex }) => ({
    themeName,
    selectedSetIndex,
  }), ['themeName', 'selectedSetIndex']),
  mapWithPropsMemo(({ componentMetaFile, componentProps }) => {
    if (isUndefined(componentMetaFile)) {
      return {}
    }

    return ({
      lines: serializeComponent(componentMetaFile.Component, componentProps, { indent: 2 }),
    })
  }, ['componentMetaFile', 'componentProps']),
  mapHandlers({
    onCopy: ({ componentMetaFile, componentProps }) => () => {
      if (isUndefined(componentMetaFile)) {
        return
      }

      const sourceString = serializeComponent(componentMetaFile.Component, componentProps, { indent: 2 })
        .reduce((result, line) => {
          const lineString = line.elements.reduce((lineResult, { value }) => {
            return lineResult + value
          }, '')

          return `${result}${lineString}\n`
        }, '')

      navigator.clipboard.writeText(sourceString)
    },
  })
)(({
  componentMetaFile,
  theme,
  themeName,
  width,
  height,
  left,
  top,
  lines,
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
      {lines && componentMetaFile && (
        <Root
          lines={lines}
          componentMetaFile={componentMetaFile}
          theme={theme[themeName]}
        />
      )}
    </Block>

    {componentMetaFile && (
      <ButtonIcon left={width - buttonIconSize - SPACER_SIZE} top={10} isInverted onPress={onCopy}>
        <IconCopy color={theme[themeName].foreground}/>
      </ButtonIcon>
    )}
  </Block>
))

SourceCode.displayName = 'SourceCode'
