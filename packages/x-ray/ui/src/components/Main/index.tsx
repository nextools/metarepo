import type { TListItems } from '@x-ray/core'
import { Fragment } from 'react'
import { component, startWithType, mapHandlers, onUpdate, mapState } from 'refun'
import { actionLoadList, actionSave, actionTab } from '../../actions'
import { COL_SPACE, COLOR_LIGHT_GREY, COLOR_DM_BLACK } from '../../config'
import { ThemeContext } from '../../context/Theme'
import { mapStoreState, mapStoreDispatch } from '../../store'
import type { TSize, TType, TTypeVariants } from '../../types'
import { Background } from '../Background'
import { Block } from '../Block'
import { Popup } from '../Popup'
import { Text } from '../Text'
import { Toolbar, TOOLBAR_WIDTH } from '../Toolbar'
import { Controls, CONTROLS_HEIGHT } from './Controls'
import { ScreenshotGrid } from './ScreenshotGrid'
import { SnapshotGrid } from './SnapshotGrid'

const isScreenshots = (items: any, type: TType | null): items is TListItems => type === 'image' && Object.keys(items).length > 0
const isSnapshots = (items: any, type: TType | null): items is TListItems => type === 'text' && Object.keys(items).length > 0

export type TMain = TSize

type TSortedDataResult = {
  items: TListItems,
  elements: {
    new: number,
    diff: number,
    deleted: number,
  },
}

const getSortedData = (activeTab: TTypeVariants | null, items: TListItems): TSortedDataResult => {
  return Object.keys(items).reduce((acc, key) => {
    let data = acc

    if (activeTab === null || (activeTab !== null && items[key].type === activeTab.toUpperCase())) {
      data = {
        ...acc,
        items: {
          ...acc.items,
          [key]: items[key],
        },
      }
    }

    if (items[key].type === 'NEW') {
      data = {
        ...data,
        elements: {
          ...data.elements,
          new: data.elements.new + 1,
        },
      }
    } else if (items[key].type === 'DIFF') {
      data = {
        ...data,
        elements: {
          ...data.elements,
          diff: data.elements.diff + 1,
        },
      }
    } else if (items[key].type === 'DELETED') {
      data = {
        ...data,
        elements: {
          ...data.elements,
          deleted: data.elements.deleted + 1,
        },
      }
    }

    return data
  }, {
    items: {},
    elements: {
      new: 0,
      diff: 0,
      deleted: 0,
    },
  })
}

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ activeTab, type, selectedItem, files, items, discardedItems, filteredFiles, isSaved }) => {
    const { items: sortedItems, elements } = getSortedData(activeTab, items)

    return {
      activeTab,
      type,
      selectedItem,
      files,
      items: sortedItems,
      discardedItems,
      filteredFiles,
      isSaved,
      elements,
    }
  }, ['activeTab', 'selectedItem', 'files', 'items', 'type', 'discardedItems', 'filteredFiles', 'isSaved']),
  mapStoreDispatch('dispatch'),
  mapState('darkMode', 'setDarkMode', () => false, []),
  onUpdate(({ dispatch }) => {
    void dispatch(actionLoadList())
  }, []),
  mapHandlers({
    onSave: ({ type, items, discardedItems, dispatch }) => async () => {
      const itemKeys = Object.keys(items)

      if (type !== null && itemKeys.length > 0) {
        await dispatch(actionSave(itemKeys, discardedItems))
      }
    },
    onTab: ({ dispatch }) => (type) => {
      dispatch(actionTab(type))
    },
    onToggleTheme: ({ darkMode, setDarkMode }) => () => {
      setDarkMode(!darkMode)
    },
  })
)(({
  activeTab,
  darkMode,
  discardedItems,
  elements,
  files,
  filteredFiles,
  height,
  isSaved,
  items,
  selectedItem,
  type,
  width,
  onSave,
  onTab,
  onToggleTheme,
}) => {
  if (isSaved) {
    return (
      <Block
        left={0}
        top={0}
        width={width}
        height={height}
      >
        <Text fontSize={26}>Saved</Text>
      </Block>
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
          activeTab={activeTab}
          elements={elements}
          width={width}
          onSave={onSave}
          onTab={onTab}
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
