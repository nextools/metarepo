import React, { Fragment } from 'react'
import { component, startWithType, onMount, mapHandlers } from 'refun'
import { Button } from '@primitives/button'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TSize, TType, TScreenshotItems, TSnapshotItems } from '../../types'
import { Popup } from '../Popup'
import { Block } from '../Block'
import { Background } from '../Background'
import { COLOR_GREEN, COL_SPACE, BORDER_WIDTH } from '../../config'
import { Toolbar, TOOLBAR_HEIGHT } from '../Toolbar'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const SAVE_BUTTON_SIZE = 48

const isScreenshots = (items: any, type: TType | null): items is TScreenshotItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TSnapshotItems => type === 'text' && Object.keys(items).length > 0

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ type, selectedItem, files, items, discardedItems, filteredFiles }) => ({
    type,
    selectedItem,
    files,
    items,
    discardedItems,
    filteredFiles,
  }), ['selectedItem', 'files', 'items', 'type', 'discardedItems', 'filteredFiles']),
  mapStoreDispatch,
  onMount(({ dispatch }) => {
    dispatch(actionLoadList())
  }),
  mapHandlers({
    onSave: ({ type, items, discardedItems, dispatch }) => () => {
      const itemKeys = Object.keys(items)

      if (type !== null && itemKeys.length > 0) {
        dispatch(actionSave(itemKeys, discardedItems))
      }
    },
  })
)(({
  width,
  height,
  selectedItem,
  items,
  discardedItems,
  filteredFiles,
  files,
  type,
  onSave,
}) => (
  <Fragment>
    <Toolbar
      top={0}
      left={0}
      width={width}
      files={files}
      filteredFiles={filteredFiles}
    />
    {isScreenshots(items, type) && (
      <ScreenshotGrid
        top={TOOLBAR_HEIGHT + BORDER_WIDTH + Number(COL_SPACE)}
        left={0}
        width={width}
        height={height - TOOLBAR_HEIGHT - BORDER_WIDTH - COL_SPACE}
        items={items}
        discardedItems={discardedItems}
        shouldAnimate={selectedItem === null}
      />
    )}
    {isSnapshots(items, type) && (
      <SnapshotGrid
        top={TOOLBAR_HEIGHT + BORDER_WIDTH + COL_SPACE}
        left={0}
        width={width}
        height={height - TOOLBAR_HEIGHT - BORDER_WIDTH - COL_SPACE}
        items={items}
        discardedItems={discardedItems}
        filteredFiles={filteredFiles}
      />
    )}
    <Block
      top={height - SAVE_BUTTON_SIZE - 10}
      left={width - SAVE_BUTTON_SIZE - 10}
      width={SAVE_BUTTON_SIZE}
      height={SAVE_BUTTON_SIZE}
      style={{
        display: 'flex',
      }}
    >
      <Background color={COLOR_GREEN}/>
      <Button onPress={onSave}/>
    </Block>
    {type !== null && selectedItem !== null && (
      <Popup
        left={0}
        top={0}
        width={width}
        height={height}
        type={type}
        item={selectedItem}
        discardedItems={discardedItems}
      />
    )}
  </Fragment>
))

Main.displayName = 'Main'
