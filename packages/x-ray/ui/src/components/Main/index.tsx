import React, { Fragment } from 'react'
import { component, startWithType, onMount, mapHandlers, mapState, mapContext } from 'refun'
import { PrimitiveImage } from '@revert/image'
import { Layout, Layout_Item, LayoutContext } from '@revert/layout'
import { Background } from '@revert/background'
import { TSnapshotItems } from '@x-ray/snapshots'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { actionLoadList, actionSave } from '../../actions'
import { TType } from '../../types'
// @ts-ignore
import noSignalImage from '../../images/no-signal.png'
import { Popup } from '../Popup'
import { Toolbar } from '../Toolbar'
import { SaveButton } from '../SaveButton'
import { TListItems } from '../../../../next/src/types'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (items: any, type: TType | null): items is TListItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TSnapshotItems => type === 'text' && Object.keys(items).length > 0

export type TMain = {}

export const Main = component(
  startWithType<TMain>(),
  mapContext(LayoutContext),
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
  onMount(async ({ dispatch }) => {
    await dispatch(actionLoadList())
  }),
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
  discardedItems,
  files,
  filteredFiles,
  _height,
  isSaved,
  items,
  type,
  _width,
  selectedItem,
  onSave,
}) => {
  if (isSaved) {
    return (
      <PrimitiveImage
        source={noSignalImage}
        width={_width}
        height={_height}
        resizeMode="contain"
      />
    )
  }

  return (
    <Fragment>
      <Layout direction="vertical">
        <Layout_Item height={60}>
          <Toolbar
            files={files}
            filteredFiles={filteredFiles}
          />
        </Layout_Item>
        <Layout_Item>
          <Background color={[136, 136, 136, 1]}/>
          {isScreenshots(items, type) && (
            <ScreenshotGrid
              items={items}
              discardedItems={discardedItems}
              filteredFiles={filteredFiles}
              shouldAnimate={selectedItem === null}
            />
          )}
          {isSnapshots(items, type) && (
            <SnapshotGrid
              items={items}
              discardedItems={discardedItems}
              filteredFiles={filteredFiles}
            />
          )}

        </Layout_Item>

      </Layout>
      <SaveButton
        onPress={onSave}
      />
      {type !== null && selectedItem !== null && (
        <Popup
          discardedItems={discardedItems}
          item={selectedItem}
          type={type}
        />
      )}
    </Fragment>
  )
})

Main.displayName = 'Main'
