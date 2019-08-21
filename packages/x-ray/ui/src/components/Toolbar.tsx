import React from 'react'
import { startWithType, component, mapState, mapHandlers } from 'refun'
import { TOmitKey } from 'tsfn'
import { TRect } from '../types'
import { mapStoreDispatch } from '../store'
import { actionAddFilter, actionRemoveFilter } from '../actions'
import { COLOR_LIGHT_GRAY, BORDER_WIDTH, COLOR_GRAY, COL_SPACE } from '../config'
import { Block } from './Block'
import { Switch, SWITCH_HEIGHT } from './Switch'
import { Background } from './Background'
import { Border } from './Border'

export const TOOLBAR_SPACING = COL_SPACE
export const TOOLBAR_HEIGHT = TOOLBAR_SPACING * 2 + SWITCH_HEIGHT

export type TToolbar = TOmitKey<TRect, 'height'> & {
  files: string[],
  filteredFiles: string[],
}

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapStoreDispatch,
  mapState('switchWidths', 'setSwitchWidths', ({ files }) => (Array.isArray(files) ? new Array(files.length).fill(0) : []) as number[], ['files']),
  mapHandlers({
    onSwitchWidthChange: ({ files, setSwitchWidths }) => (file: string, width: number) => {
      setSwitchWidths((switchWidths) => {
        const newState = switchWidths.slice()

        newState[files.indexOf(file)] = width

        return newState
      })
    },
    onSwitchToggle: ({ dispatch }) => (file: string, isActive: boolean) => {
      dispatch(isActive ? actionAddFilter(file) : actionRemoveFilter(file))
    },
  })
)(({ files, filteredFiles, width, switchWidths, onSwitchToggle, onSwitchWidthChange }) => (
  <Block
    left={0}
    top={0}
    width={width}
    height={TOOLBAR_HEIGHT}
  >
    <Background color={COLOR_LIGHT_GRAY}/>
    <Border
      color={COLOR_GRAY}
      bottomWidth={BORDER_WIDTH}
      overflowBottom={BORDER_WIDTH}
    />
    {
      switchWidths.map((switchWidth, i) => {
        const left = switchWidths.slice(0, i).reduce((r, w) => r + w, 0) + TOOLBAR_SPACING * (i + 1)
        const file = files[i]

        return (
          <Switch
            key={i}
            top={TOOLBAR_SPACING}
            left={left}
            width={switchWidth}
            file={file}
            filteredFiles={filteredFiles}
            onWidthChange={onSwitchWidthChange}
            onToggle={onSwitchToggle}
          />
        )
      })
    }
  </Block>
))
