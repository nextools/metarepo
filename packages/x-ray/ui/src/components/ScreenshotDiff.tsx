import { colorToString } from '@revert/color'
import { Fragment } from 'react'
import { startWithType, pureComponent, mapContext, mapWithPropsMemo } from 'refun'
import type { TOmitKey } from 'tsfn'
import type { TApiLoadScreenshotOpts } from '../api'
import { DASH_SPACE, COLOR_WHITE, COLOR_DM_BLACK, DISCARD_ALPHA, BORDER_SIZE, COLOR_BORDER_DELETED, COLOR_BORDER_NEW } from '../config'
import { ThemeContext } from '../context/Theme'
import type { TPosition } from '../types'
import { Background } from './Background'
import { Block } from './Block'
import { Screenshot } from './Screenshot'

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
  startWithType<TScreenshotDiff>(),
  mapContext(ThemeContext),
  mapWithPropsMemo(({ darkMode }) => ({
    color: {
      border: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
      background: darkMode ? COLOR_DM_BLACK : COLOR_WHITE,
    },
  }), ['darkMode'])
)(({
  color,
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
  hasNoBorder = false,
}) => (
  <Fragment>
    <Block
      top={top}
      left={left}
      width={oldWidth}
      height={oldHeight}
      opacity={Math.min(oldAlpha, isDiscarded ? DISCARD_ALPHA : 1)}
      style={{
        cursor: 'pointer',
        backgroundImage: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_DELETED)} ${DASH_SPACE}px)`,
      }}
    >
      <Block
        top={BORDER_SIZE}
        left={BORDER_SIZE}
        width={oldWidth - BORDER_SIZE * 2}
        height={oldHeight - BORDER_SIZE * 2}
      >
        <Background color={color.background}/>
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
        cursor: 'pointer',
        backgroundImage: hasNoBorder ? 'none' : `repeating-linear-gradient(45deg,${colorToString(color.border)},${colorToString(color.border)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${BORDER_SIZE}px,${colorToString(COLOR_BORDER_NEW)} ${DASH_SPACE}px)`,
      }}
    >
      <Block
        left={BORDER_SIZE}
        top={BORDER_SIZE}
      >
        <Background color={color.background}/>
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
