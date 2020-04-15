import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState, onUpdate } from 'refun'
import { Image } from '@primitives/image'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TSize, TType, TScreenshotItems, TSnapshotItems } from '../../types'
// @ts-ignore
import noSignalImage from '../../images/no-signal.png'
import { Popup } from '../Popup'
import { Block } from '../Block'
import { Background } from '../Background'
import { COL_SPACE, BORDER_SIZE, COLOR_GRAY } from '../../config'
import { Toolbar, TOOLBAR_HEIGHT } from '../Toolbar'
import { SaveButton, SAVE_BUTTON_HEIGHT } from '../SaveButton'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (items: any, type: TType | null): items is TScreenshotItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TSnapshotItems => type === 'text' && Object.keys(items).length > 0

export type TMain = TSize

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ type, selectedItem, files, items, discardedItems, filteredFiles, isSaved }) => ({
    type,
    selectedItem,
    files,
    items,
    discardedItems,
    filteredFiles,
    isSaved,
  }), ['selectedItem', 'files', 'items', 'type', 'discardedItems', 'filteredFiles', 'isSaved']),
  mapStoreDispatch('dispatch'),
  onUpdate(({ dispatch }) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dispatch(actionLoadList())
  }, []),
  mapHandlers({
    onSave: ({ type, items, discardedItems, dispatch }) => async () => {
      const itemKeys = Object.keys(items)

      if (type !== null && itemKeys.length > 0) {
        await dispatch(actionSave(itemKeys, discardedItems))
      }
    },
  }),
  mapState('saveButtonWidth', 'setSaveButtonWidth', () => 0, [])
)(({
  width,
  height,
  selectedItem,
  items,
  discardedItems,
  filteredFiles,
  files,
  type,
  saveButtonWidth,
  setSaveButtonWidth,
  isSaved,
  onSave,
}) => {
  if (isSaved) {
    return (
      <Image
        source={noSignalImage}
        width={width}
        height={height}
        resizeMode="contain"
      />
    )
  }

  return (
    <Fragment>
      <Toolbar
        top={0}
        left={0}
        width={width}
        files={files}
        filteredFiles={filteredFiles}
      />
      <Block
        left={0}
        top={TOOLBAR_HEIGHT}
        width={width}
        height={BORDER_SIZE}
      >
        <Background color={COLOR_GRAY}/>
      </Block>
      {isScreenshots(items, type) && (
        <ScreenshotGrid
          top={TOOLBAR_HEIGHT + BORDER_SIZE + COL_SPACE}
          left={0}
          width={width}
          height={height - TOOLBAR_HEIGHT - BORDER_SIZE - COL_SPACE}
          items={items}
          discardedItems={discardedItems}
          filteredFiles={filteredFiles}
          shouldAnimate={selectedItem === null}
        />
      )}
      {isSnapshots(items, type) && (
        <SnapshotGrid
          top={TOOLBAR_HEIGHT + BORDER_SIZE + COL_SPACE}
          left={0}
          width={width}
          height={height - TOOLBAR_HEIGHT - BORDER_SIZE - COL_SPACE}
          items={items}
          discardedItems={discardedItems}
          filteredFiles={filteredFiles}
        />
      )}
      <SaveButton
        top={height - SAVE_BUTTON_HEIGHT - 10}
        left={width - saveButtonWidth - 10}
        width={saveButtonWidth}
        onPress={onSave}
        onWidthChange={setSaveButtonWidth}
      />
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
  )
})

Main.displayName = 'Main'
