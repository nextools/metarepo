import React from 'react'
import { startWithType, component, mapHandlers, mapStateRef } from 'refun'
import { TPosition } from '../types'
import { mapStoreDispatch } from '../store'
import { actionAddFilter, actionRemoveFilter } from '../actions'
import { COL_SPACE, COLOR_WHITE, COLOR_GREY, BORDER_SIZE_SMAL } from '../config'
import { Block } from './Block'
import { Switch, SWITCH_HEIGHT } from './Switch'
import { Background } from './Background'
import { Border } from './Border'

export const TOOLBAR_SPACING = COL_SPACE
export const TOOLBAR_WIDTH = TOOLBAR_SPACING * 2 + 200

export type TToolbar = TPosition & {
  files: string[],
  filteredFiles: string[],
  height: number,
}

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapStoreDispatch('dispatch'),
  // TODO remove
  mapStateRef('switchWidthsRef', 'flushSwitchWidths', ({ files }) => (Array.isArray(files) ? new Array(files.length).fill(0) : []) as number[], ['files']),
  mapHandlers({
    onSwitchToggle: ({ dispatch }) => (file: string, isActive: boolean) => {
      dispatch(isActive ? actionAddFilter(file) : actionRemoveFilter(file))
    },
  })
)(({ files, filteredFiles, height, switchWidthsRef, onSwitchToggle }) => (
  <Block
    left={0}
    top={0}
    width={TOOLBAR_WIDTH}
    height={height}
    shouldScrollY
  >
    <Block
      height={height}
      width={TOOLBAR_WIDTH}
      shouldFlow
    >
      <Background color={COLOR_WHITE}/>
      <Border
        color={COLOR_GREY}
        topWidth={0}
        leftWidth={0}
        rightWidth={BORDER_SIZE_SMAL}
        bottomWidth={0}
      />
    </Block>
    {
      switchWidthsRef.current.map((switchWidth, i) => {
        const top = i * SWITCH_HEIGHT
        const file = files[i]

        return (
          <Switch
            key={i}
            top={top}
            left={0}
            width={TOOLBAR_WIDTH}
            file={file}
            filteredFiles={filteredFiles}
            onToggle={onSwitchToggle}
          />
        )
      })
    }
  </Block>
))
