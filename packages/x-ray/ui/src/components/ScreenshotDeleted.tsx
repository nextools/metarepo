import React from 'react'
import { startWithType, pureComponent, mapContext, mapWithPropsMemo } from 'refun'
import { TOmitKey } from 'tsfn'
import { colorToString } from 'colorido'
import { TRect } from '../types'
import { TApiLoadScreenshotOpts } from '../api'
import { COLOR_BORDER_DELETED, DISCARD_ALPHA, BORDER_SIZE, DASH_SPACE, COLOR_WHITE, COLOR_DM_BLACK } from '../config'
import { ThemeContext } from '../context/Theme'
import { Screenshot } from './Screenshot'
import { Block } from './Block'

export type TScreenshotDeleted = TRect & TOmitKey<TApiLoadScreenshotOpts, 'type'> & {
  isDiscarded: boolean,
  hasNoBorder?: boolean,
}

export const ScreenshotDeleted = pureComponent(
  startWithType<TScreenshotDeleted>(),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      border: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
    },
  }), ['darkMode'])
)(({ color, top, left, width, height, id, isDiscarded, hasNoBorder }) => (
  <Block
    top={top}
    left={left}
    width={width}
    height={height}
    opacity={isDiscarded ? DISCARD_ALPHA : 1}
    style={{
      background: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${DASH_SPACE}px)`,
    }}
  >
    <Block left={BORDER_SIZE} top={BORDER_SIZE}>
      <Screenshot
        id={id}
        type="ORIG"
        width={width - BORDER_SIZE * 2}
        height={height - BORDER_SIZE * 2}
      />
    </Block>
  </Block>
))

ScreenshotDeleted.displayName = 'ScreenshotDeleted'
