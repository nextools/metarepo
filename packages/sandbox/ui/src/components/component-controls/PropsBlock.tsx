import React, { Fragment } from 'react'
import { getBaseName, isChildrenMap, makeIndexedNames, TMetaFile } from 'autoprops'
import { isUndefined, TAnyObject } from 'tsfn'
import { component, startWithType, mapWithProps, mapWithPropsMemo, getComponentName, mapContext } from 'refun'
import { Background } from '../background'
import { Text, textHeight } from '../text'
import { Block } from '../block'
import { TThemeName } from '../../types'
import { ThemeContext } from '../themes'
import { getRowWidth, getColumnWidth, SPACER_SIZE, ROW_HEIGHT, TEXT_SPACER_SIZE, TITLE_HEIGHT } from './calculate-size'
import { getPropPairs } from './get-props-pairs'
import { ValueCheckbox } from './ValueCheckbox'
import { ValueDropdown } from './ValueDropdown'
import { ComponentSwitch, componentSwitchSize } from './ComponentSwitch'

const isPropConfigBoolean = (propConfig: any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'boolean')
const isPropConfigString = (propConfig: any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'string' || c === null)
const isPropConfigNumber = (propConfig: any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'number')
const isPropConfigFunction = (propConfig: any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'function')
const isPropConfigSymbol = (propConfig: any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'symbol')

export type TPropsBlock = {
  componentMetaFile: TMetaFile,
  componentProps: TAnyObject,
  left: number,
  top: number,
  width: number,
  propPath: string[],
  themeName: TThemeName,
  onChange: (propPath: string[], propValue: any) => void,
}

export const PropsBlock = component(
  startWithType<TPropsBlock>(),
  mapContext(ThemeContext),
  mapWithProps(({ theme, themeName }) => {
    const selectedTheme = theme[themeName]

    return {
      textColor: selectedTheme.text,
      borderColor: selectedTheme.border,
      iconColor: selectedTheme.foreground,
    }
  }),
  mapWithProps(({ width }) => ({
    rowWidth: getRowWidth(width),
    columnWidth: getColumnWidth(width),
  })),
  mapWithPropsMemo(({ componentMetaFile }) => ({
    propPairs: componentMetaFile ? getPropPairs(componentMetaFile.config.props) : [],
  }), ['componentMetaFile']),
  mapWithProps(({ componentProps, componentMetaFile }) => ({
    activeChildrenKeys: isChildrenMap(componentProps.children) ? Object.keys(componentProps.children) : [] as string[],
    allChildrenIndexedKeys: !isUndefined(componentMetaFile.childrenConfig) ? makeIndexedNames(componentMetaFile.childrenConfig.children) : [] as string[],
  }))
)(({
  componentMetaFile,
  componentProps,
  activeChildrenKeys,
  allChildrenIndexedKeys,
  propPairs,
  propPath,
  left,
  top,
  width,
  rowWidth,
  columnWidth,
  textColor,
  borderColor,
  iconColor,
  onChange,
}) => (
  <Block top={top} left={left} width={width}>

    <Block
      top={SPACER_SIZE}
      left={SPACER_SIZE}
      width={rowWidth}
      height={textHeight}
    >
      <Text color={textColor} isBold>{getComponentName(componentMetaFile.Component)}</Text>
    </Block>

    {propPairs.map((row, rowIndex) => (
      <Fragment key={rowIndex}>
        {
          row.map((propName, colIndex) => {
            if (isUndefined(propName)) {
              return null
            }

            const propPossibleValues = componentMetaFile.config.props[propName]
            const isPropRequired = Array.isArray(componentMetaFile.config.required) && componentMetaFile.config.required.includes(propName)
            const propValue = componentProps[propName]
            const left = SPACER_SIZE + colIndex * (SPACER_SIZE + columnWidth)
            const currentTop = TITLE_HEIGHT + rowIndex * ROW_HEIGHT
            const propNamePath = [...propPath, propName]

            if (isPropConfigBoolean(propPossibleValues)) {
              return (
                <Fragment key={`${rowIndex}-${colIndex}`}>
                  <Block
                    left={left}
                    top={currentTop}
                    width={columnWidth}
                    height={textHeight}
                  >
                    <Text color={textColor} isBold>{propName}</Text>
                  </Block>
                  <ValueCheckbox
                    left={left}
                    top={currentTop + textHeight + TEXT_SPACER_SIZE}
                    propPath={propNamePath}
                    propValue={propValue}
                    onChange={onChange}
                  />
                </Fragment>
              )
            }

            if (propName === 'children' || isPropConfigNumber(propPossibleValues) || isPropConfigString(propPossibleValues) || isPropConfigFunction(propPossibleValues) || isPropConfigSymbol(propPossibleValues)) {
              return (
                <Fragment key={`${rowIndex}-${colIndex}`}>
                  <Block
                    left={left}
                    top={currentTop}
                    width={columnWidth}
                    height={textHeight}
                  >
                    <Text color={textColor} isBold shouldHideOverflow>{propName}</Text>
                  </Block>
                  <ValueDropdown
                    left={left}
                    top={currentTop + textHeight + TEXT_SPACER_SIZE}
                    width={columnWidth}
                    propPossibleValues={propPossibleValues}
                    isPropRequired={isPropRequired}
                    propPath={propNamePath}
                    propValue={propValue}
                    onChange={onChange}
                  />
                </Fragment>
              )
            }
          })
        }
      </Fragment>
    ))}

    {allChildrenIndexedKeys.map((childIndexedKey, childIndex) => {
      const childrenConfig = componentMetaFile.childrenConfig

      if (isUndefined(childrenConfig)) {
        throw new Error(`Cannot get childrenConfig for ${getComponentName(componentMetaFile.Component)}`)
      }

      let prevSize = 0

      for (let i = 0; i < childIndex; ++i) {
        prevSize += TITLE_HEIGHT
      }

      const childKey = getBaseName(childIndexedKey)
      const childMetaFile = childrenConfig.meta[childKey]
      const childDisplayName = getComponentName(childMetaFile.Component)
      const currentTop = propPairs.length * ROW_HEIGHT + TITLE_HEIGHT + prevSize
      const isChildActive = activeChildrenKeys.includes(childIndexedKey)
      const isChildRequired = Array.isArray(childrenConfig.required) && childrenConfig.required.includes(childKey)
      const propChildPath = [...propPath, 'children', childIndexedKey]

      return (
        <Fragment key={childIndex}>
          <Block
            top={currentTop}
            left={0}
            width={width}
            height={1}
          >
            <Background color={borderColor}/>
          </Block>

          <Block
            top={currentTop + SPACER_SIZE}
            left={SPACER_SIZE}
            width={rowWidth}
            height={textHeight}
          >
            <Text color={textColor} isBold>{childDisplayName}</Text>
          </Block>
          {!isChildRequired && (
            <ComponentSwitch
              top={currentTop + (TITLE_HEIGHT - componentSwitchSize) / 2}
              left={width - componentSwitchSize - SPACER_SIZE}
              propPath={propChildPath}
              color={iconColor}
              isChecked={isChildActive}
              onChange={onChange}
            />
          )}
        </Fragment>
      )
    })}
  </Block>
))

PropsBlock.displayName = 'PropsBlock'
