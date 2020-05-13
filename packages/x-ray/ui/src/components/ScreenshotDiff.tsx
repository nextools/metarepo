import React, { Fragment } from 'react'
import { startWithType, pureComponent } from 'refun'
import { TOmitKey } from 'tsfn'
import { colorToString } from 'colorido'
import { TPosition } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, COLOR_BORDER_NEW, DISCARD_ALPHA, BORDER_SIZE, DASH_SPACE, COLOR_WHITE } from '../config'
import { Background } from './Background'
import { Screenshot } from './Screenshot'
import { Block } from './Block'

export type TScreenshotDiff = TPosition & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  oldWidth: number,
  oldHeight: number,
  newWidth: number,
  newHeight: number,
  oldAlpha: number,
  newAlpha: number,
  isDiscarded: boolean,
  hasNoBorder?: boolean,
}

export const ScreenshotDiff = pureComponent(
  startWithType<TScreenshotDiff>()
)(({
  left,
  top,
  oldWidth,
  oldHeight,
  newWidth,
  newHeight,
  oldAlpha,
  newAlpha,
  id,
  isDiscarded,
  hasNoBorder,
}) => (
  <Fragment>
    <Block
      top={top}
      left={left}
      width={oldWidth}
      height={oldHeight}
      opacity={Math.min(oldAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
      style={{
        background: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,#fff,#fff ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${DASH_SPACE}px)`,
      }}
    >
      <Block
        top={BORDER_SIZE}
        left={BORDER_SIZE}
        width={oldWidth - BORDER_SIZE * 2}
        height={oldHeight - BORDER_SIZE * 2}
      >
        <Background color={COLOR_WHITE}/>
      </Block>
      <Block left={BORDER_SIZE} top={BORDER_SIZE}>
        <Screenshot
          id={id}
          type="ORIG"
          width={oldWidth - BORDER_SIZE * 2}
          height={oldHeight - BORDER_SIZE * 2}
        />
      </Block>
    </Block>
    <Block
      top={top}
      left={left}
      width={newWidth}
      height={newHeight}
      opacity={Math.min(newAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
      style={{
        background: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,#fff,#fff ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${DASH_SPACE}px)`,
      }}
    >
      <Block
        left={BORDER_SIZE}
        top={BORDER_SIZE}
      >
        <Background color={COLOR_WHITE}/>
        <Screenshot
          id={id}
          type="NEW"
          width={newWidth - BORDER_SIZE * 2}
          height={newHeight - BORDER_SIZE * 2}
        />
      </Block>
    </Block>
  </Fragment>
))

ScreenshotDiff.displayName = 'ScreenshotDiff'
