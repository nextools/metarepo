import React from 'react'
import { component, startWithType } from 'refun'
import { TSyntxLines } from '@x-ray/common-utils'
import { TRect } from '../../types'
import { Block } from '../Block'
import { LineElement } from './LineElement'
import { LINE_HEIGHT } from './constants'

export type TSourceCode = TRect & {
  source: TSyntxLines,
}

export const SourceCode = component(
  startWithType<TSourceCode>()
)(({ top, left, width, height, source }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    shouldScrollX
    shouldScrollY
  >
    <Block height={source.length * LINE_HEIGHT} shouldFlow/>
    {source.map((line, i) => (
      <Block
        key={i}
        left={0}
        top={i * LINE_HEIGHT}
        right={0}
        height={LINE_HEIGHT}
        shouldPreventWrap
      >
        {line.map((element, i) => (
          <LineElement key={i} type={element.type}>
            {element.value}
          </LineElement>
        ))}
      </Block>
    ))}
  </Block>
))

SourceCode.displayName = 'SourceCode'
