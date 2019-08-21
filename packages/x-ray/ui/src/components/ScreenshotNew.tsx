import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_NEW, DISCARD_ALPHA, BORDER_WIDTH } from '../config'
import { Block } from './Block'
import { Border } from './Border'
import { Screenshot } from './Screenshot'

export type TScreenshotNew = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
}

export const ScreenshotNew = pureComponent(
  startWithType<TScreenshotNew>()
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
      type="new"
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
      color={COLOR_BORDER_NEW}
    />
  </Block>
))

ScreenshotNew.displayName = 'ScrenshotNew'
