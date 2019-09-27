import React from 'react'
import { serializeComponent, TYPE_COMPONENT_NAME, TYPE_VALUE_SYMBOL } from 'syntx'
import { startWithType, pureComponent, mapWithPropsMemo, mapHandlers, mapContext } from 'refun'
import { TAnyObject, isUndefined, isString } from 'tsfn'
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
  copyImportPackageName?: string,
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
    onCopy: ({ componentMetaFile, componentProps, copyImportPackageName }) => () => {
      if (isUndefined(componentMetaFile)) {
        return
      }

      const imports = new Set<string>()

      const sourceString = serializeComponent(componentMetaFile.Component, componentProps, { indent: 2 })
        .reduce((result, line) => {
          const lineString = line.elements.reduce((lineResult, { type, value }) => {
            if (type === TYPE_COMPONENT_NAME || type === TYPE_VALUE_SYMBOL) {
              imports.add(value)
            }

            return lineResult + value
          }, '')

          return `${result}${lineString}\n`
        }, '')

      let importsStr = ''

      if (isString(copyImportPackageName)) {
        importsStr += 'import {\n  '
        importsStr += Array.from(imports)
          .sort()
          .join(',\n  ')
        importsStr += `\n} from '${copyImportPackageName}'\n\n`
      }

      navigator.clipboard.writeText(importsStr + sourceString)
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
          width={width}
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
