import React, { Fragment } from 'react'
import { startWithType, component, mapState, mapHandlers } from 'refun'
import { Border } from '@revert/border'
import { Background } from '@revert/background'
import { Checkbox } from '@revert/checkbox'
import { Text } from '@revert/text'
import { COLOR_GREEN, COLOR_WHITE, BORDER_SIZE } from '../config'

export const SWITCH_HORIZONTAL_PADDING = 10
export const SWITCH_HEIGHT = 24 + BORDER_SIZE * 2
export const SWITCH_LINE_HEIGHT = 18
export const SWITCH_FONT_SIZE = 16

export type TSwitch = {
  file: string,
  filteredFiles: string[],
  onToggle: (file: string, isActive: boolean) => void,
}

export const Switch = component(
  startWithType<TSwitch>(),
  mapState('isActive', 'setIsActive', ({ filteredFiles, file }) => filteredFiles.includes(file), ['filteredFiles', 'file']),
  mapHandlers({
    onToggle: ({ file, isActive, setIsActive, onToggle }) => () => {
      setIsActive(!isActive)
      onToggle(file, !isActive)
    },
  })
)(({ isActive, file, onToggle }) => (
  <Fragment>
    <Background color={isActive ? COLOR_GREEN : COLOR_WHITE}/>
    <Border
      color={COLOR_GREEN}
      borderWidth={BORDER_SIZE}
    />
    <Checkbox
      isChecked={isActive}
      onToggle={onToggle}
    >
      <Text
        lineHeight={SWITCH_LINE_HEIGHT}
        fontSize={SWITCH_FONT_SIZE}
        fontFamily="sans-serif"
        shouldPreserveWhitespace
      >
        {file}
      </Text>
    </Checkbox>

  </Fragment>
))
