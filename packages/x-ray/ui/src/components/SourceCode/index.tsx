import React, { Fragment } from 'react'
import { component, startWithType } from 'refun'
import { TLineElement } from 'syntx'
import { Block } from '../Block'
import { LineElement } from './LineElement'
import { LINE_HEIGHT } from './constants'

export type TSyntxLines = TLineElement[][]

export type TSourceCode = {
  source: TSyntxLines,
}

export const SourceCode = component(
  startWithType<TSourceCode>()
)(({ source }) => (
  <Fragment>
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
  </Fragment>
))

SourceCode.displayName = 'SourceCode'
