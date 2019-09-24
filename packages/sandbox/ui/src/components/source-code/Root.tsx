import React, { FC } from 'react'
import { TLine } from 'syntx'
import { TMetaFile } from 'autoprops'
import { Block } from '../block'
import { TTheme } from '../../types'
import { LINE_HEIGHT } from './utils'
import { Line } from './Line'
import { LineElement } from './LineElement'

export type TRoot = {
  lines: TLine[],
  theme: TTheme,
  componentMetaFile: TMetaFile,
}

export const Root: FC<TRoot> = ({ lines, theme, componentMetaFile }) => {
  return (
    <Block height={lines.length * LINE_HEIGHT} shouldFlow>
      {lines.map((line, i) => (
        <Block key={i} left={0} top={i * LINE_HEIGHT} right={0} height={LINE_HEIGHT}>
          <Line path={line.path} index={i + 1} componentMetaFile={componentMetaFile}>
            {line.elements.map((element, i) => (
              <LineElement key={i} type={element.type} theme={theme}>
                {element.value}
              </LineElement>
            ))}
          </Line>
        </Block>
      ))}
    </Block>
  )
}
