import { Fragment } from 'react'
import { component, startWithType } from 'refun'
import type { TLineElement } from 'syntx'
import type { TJsonValue } from 'typeon'
import { Block } from '../Block'
import { LineElement } from './LineElement'
import { LINE_HEIGHT } from './constants'

export type TSourceCode = {
  source: TJsonValue,
}

const isLineElements = (source: TJsonValue): source is TLineElement[][] => Array.isArray(source)

export const SourceCode = component(
  startWithType<TSourceCode>()
)(({ source }) => {
  if (!isLineElements(source)) {
    throw new Error('Invalid source format')
  }

  return (
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
  )
})

SourceCode.displayName = 'SourceCode'
