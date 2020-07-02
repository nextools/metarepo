import { Image } from '@primitives/image'
import { TListItems } from '@x-ray/core'
import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, onUpdate, mapState } from 'refun'
import { actionLoadList, actionSave } from '../../actions'
import { COL_SPACE, COLOR_LIGHT_GREY, COLOR_DM_BLACK } from '../../config'
import { ThemeContext } from '../../context/Theme'
import noSignalImage from '../../images/no-signal.png'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { TSize, TType } from '../../types'
// @ts-ignore
import { Background } from '../Background'
import { Block } from '../Block'
import { Popup } from '../Popup'
import { Toolbar, TOOLBAR_WIDTH } from '../Toolbar'
import { Controls, CONTROLS_HEIGHT } from './Controls'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (items: any, type: TType | null): items is TListItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TListItems => type === 'text' && Object.keys(items).length > 0

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
    elements: Object.keys(items).reduce((acc, key) => {
      if (items[key].type === 'NEW') {
        return {
          ...acc,
          new: acc.new + 1,
        }
      } else if (items[key].type === 'DIFF') {
        return {
          ...acc,
          diff: acc.diff + 1,
        }
      } else if (items[key].type === 'DELETED') {
        return {
          ...acc,
          deleted: acc.deleted + 1,
        }
      }

      return acc
    }, {
      new: 0,
      diff: 0,
      deleted: 0,
    }),
  }), ['selectedItem', 'files', 'items', 'type', 'discardedItems', 'filteredFiles', 'isSaved']),
  mapStoreDispatch('dispatch'),
  mapState('darkMode', 'setDarkMode', () => false, []),
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
    onToggleTheme: ({ darkMode, setDarkMode }) => () => {
      setDarkMode(!darkMode)
    },
  })
)(({
  width,
  height,
  selectedItem,
  items,
  elements,
  discardedItems,
  filteredFiles,
  files,
  type,
  darkMode,
  isSaved,
  onSave,
  onToggleTheme,
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
      <ThemeContext.Provider value={{ darkMode, onToggleTheme }}>
        <Toolbar
          top={0}
          left={0}
          height={height}
          files={files}
          filteredFiles={filteredFiles}
        />
        <Controls
          width={width}
          elements={elements}
          onSave={onSave}
        />
        <Block
          top={CONTROLS_HEIGHT}
          left={TOOLBAR_WIDTH}
          width={width}
          height={height - CONTROLS_HEIGHT}
        >
          <Background color={darkMode ? COLOR_DM_BLACK : COLOR_LIGHT_GREY}/>
          {isScreenshots(items, type) && (
            <ScreenshotGrid
              top={COL_SPACE}
              left={0}
              width={width - TOOLBAR_WIDTH}
              height={height - CONTROLS_HEIGHT}
              items={items}
              discardedItems={discardedItems}
              filteredFiles={filteredFiles}
              shouldAnimate={selectedItem === null}
            />
          )}
          {isSnapshots(items, type) && (
            <SnapshotGrid
              top={COL_SPACE}
              left={0}
              width={width - TOOLBAR_WIDTH}
              height={height - CONTROLS_HEIGHT}
              items={items}
              discardedItems={discardedItems}
              filteredFiles={filteredFiles}
            />
          )}
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
      </ThemeContext.Provider>
    </Fragment>
  )
})

Main.displayName = 'Main'
