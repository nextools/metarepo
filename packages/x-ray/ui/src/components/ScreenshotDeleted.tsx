import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, DISCARD_ALPHA, BORDER_WIDTH } from '../config'
import { Block } from './Block'
import { Border } from './Border'
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
    style={{
      cursor: 'pointer',
    }}
  >
    <Screenshot
      id={id}
      type="old"
      width={width}
      height={height}
    />
    <Border
      topWidth={BORDER_WIDTH}
      leftWidth={BORDER_WIDTH}
      rightWidth={BORDER_WIDTH}
      bottomWidth={BORDER_WIDTH}
      overflowTop={BORDER_WIDTH}
      overflowLeft={BORDER_WIDTH}
      overflowRight={BORDER_WIDTH}
      overflowBottom={BORDER_WIDTH}
      color={COLOR_BORDER_DELETED}
    />
  </Block>
))

ScreenshotDeleted.displayName = 'ScreenshotDeleted'
