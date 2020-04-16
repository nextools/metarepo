import React from 'react'
import { component, startWithType } from 'refun'
import { PrimitiveBlock as Block } from '@revert/block'
import { TLineElement } from 'syntx'
import { TRect } from '../../types'
import { LineElement } from './LineElement'
import { LINE_HEIGHT } from './constants'

export type TSyntxLines = TLineElement[][]

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
    shouldScroll
  >
    <Block height={source.length * LINE_HEIGHT} shouldFlow/>
    {source.map((line, i) => (
      <Block
        key={i}
        left={0}
        top={i * LINE_HEIGHT}
        right={0}
        height={LINE_HEIGHT}
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
