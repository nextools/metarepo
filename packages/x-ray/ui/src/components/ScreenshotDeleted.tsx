import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { PrimitiveBorder as Border } from '@revert/border'
import { PrimitiveBlock as Block } from '@revert/block'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, DISCARD_ALPHA, BORDER_SIZE } from '../config'
import { Screenshot } from './Screenshot'

export type TScreenshotDeleted = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
}

export const ScreenshotDeleted = pureComponent(
  startWithType<TScreenshotDeleted>()
)(({ top, left, width, height, id, isDiscarded }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
  >
    <Block left={BORDER_SIZE} top={BORDER_SIZE}>
      <Screenshot
        id={id}
        type="ORIG"
        width={width - BORDER_SIZE * 2}
        height={height - BORDER_SIZE * 2}
      />
    </Block>
    <Border
      borderWidth={BORDER_SIZE}
      color={COLOR_BORDER_DELETED}
    />
  </Block>
))

ScreenshotDeleted.displayName = 'ScreenshotDeleted'
