import React from 'react'
import { startWithType, component, mapHandlers } from 'refun'
import { Scroll } from '@revert/scroll'
import { Layout_Item } from '@revert/layout/src/index.native'
import { Layout } from '@revert/layout'
import { mapStoreDispatch } from '../store'
import { actionAddFilter, actionRemoveFilter } from '../actions'
import { COL_SPACE } from '../config'
import { Switch } from './Switch'

export type TToolbar = {
  files: string[],
  filteredFiles: string[],
}

export const Toolbar = component(
  startWithType<TToolbar>(),
  mapStoreDispatch('dispatch'),
  mapHandlers({
    onSwitchToggle: ({ dispatch }) => (file: string, isActive: boolean) => {
      dispatch(isActive ? actionAddFilter(file) : actionRemoveFilter(file))
    },
  })
)(({ files, filteredFiles, onSwitchToggle }) => (
  <Scroll shouldScrollHorizontally>
    <Layout
      spaceBetween={COL_SPACE}
      hPadding={COL_SPACE}
      vPadding={COL_SPACE}
    >
      {files.map((file) => (
        <Layout_Item
          key={file}
          vPadding={COL_SPACE}
          hPadding={COL_SPACE}
          vAlign="center"
        >
          <Switch
            file={file}
            filteredFiles={filteredFiles}
            onToggle={onSwitchToggle}
          />
        </Layout_Item>
      ))}
    </Layout>
  </Scroll>
))
