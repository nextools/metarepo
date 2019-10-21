import React, { Fragment } from 'react'
import { isChildrenMap, TComponentConfig, getChildrenKeys } from 'autoprops'
import { isUndefined, TAnyObject } from 'tsfn'
import { component, startWithType, mapWithProps, mapWithPropsMemo } from 'refun'
import { Background } from '../background'
import { Text, textHeight } from '../text'
import { Block } from '../block'
import { TTheme } from '../../types'
import { getComponentName } from '../../utils'
import { getRowWidth, getColumnWidth, SPACER_SIZE, ROW_HEIGHT, TEXT_SPACER_SIZE, TITLE_HEIGHT } from './calculate-size'
import { getPropPairs } from './get-props-pairs'
import { ValueCheckbox } from './ValueCheckbox'
import { ValueDropdown } from './ValueDropdown'
import { ComponentSwitch, componentSwitchSize } from './ComponentSwitch'

const isCheckboxValues = (propConfig: readonly any[]) => propConfig.every((c) => isUndefined(c) || typeof c === 'boolean')

export type TPropsBlock = {
  componentName: string,
  componentConfig: TComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  left: number,
  top: number,
  width: number,
  propPath: readonly string[],
  theme: TTheme,
  onChange: (propPath: readonly string[], propValue: any) => void,
}

export const PropsBlock = component(
  startWithType<TPropsBlock>(),
  mapWithProps(({ theme }) => ({
    textColor: theme.text,
    borderColor: theme.border,
    iconColor: theme.foreground,
  })),
  mapWithProps(({ width }) => ({
    rowWidth: getRowWidth(width),
    columnWidth: getColumnWidth(width),
  })),
  mapWithPropsMemo(({ componentConfig }) => ({
    propPairs: getPropPairs(componentConfig.props),
    allChildrenKeys: getChildrenKeys(componentConfig) as readonly string[],
  }), ['componentConfig']),
  mapWithProps(({ componentPropsChildrenMap }) => ({
    activeChildrenKeys: (isChildrenMap(componentPropsChildrenMap.children)
      ? Object.keys(componentPropsChildrenMap.children)
      : []) as readonly string[],
  }))
)(({
  componentName,
  componentConfig,
  componentPropsChildrenMap,
  activeChildrenKeys,
  allChildrenKeys,
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
      <Text color={textColor} isBold>{componentName}</Text>
    </Block>

    {propPairs.map((row, rowIndex) => (
      row.map((propName, colIndex) => {
        if (isUndefined(propName)) {
          return null
        }

        const propPossibleValues = componentConfig.props[propName]
        const isPropRequired = Array.isArray(componentConfig.required) && componentConfig.required.includes(propName)
        const propValue = componentPropsChildrenMap[propName]
        const left = SPACER_SIZE + colIndex * (SPACER_SIZE + columnWidth)
        const currentTop = TITLE_HEIGHT + rowIndex * ROW_HEIGHT
        const propNamePath = [...propPath, propName]

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
            {isCheckboxValues(propPossibleValues)
              ? (
                <ValueCheckbox
                  left={left}
                  top={currentTop + textHeight + TEXT_SPACER_SIZE}
                  propPath={propNamePath}
                  propValue={propValue}
                  onChange={onChange}
                />
              )
              : (
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
              )}
          </Fragment>
        )
      })
    ))}

    {allChildrenKeys.map((childKey, childIndex) => {
      const childrenConfig = componentConfig.children

      if (isUndefined(childrenConfig)) {
        throw new Error(`Cannot get childrenConfig for ${componentName}`)
      }

      let prevSize = 0

      for (let i = 0; i < childIndex; ++i) {
        prevSize += TITLE_HEIGHT
      }

      const childMetaFile = childrenConfig[childKey]
      const childDisplayName = getComponentName(childMetaFile.Component)
      const currentTop = propPairs.length * ROW_HEIGHT + TITLE_HEIGHT + prevSize
      const isChildActive = activeChildrenKeys.includes(childKey)
      const isChildRequired = Array.isArray(componentConfig.required) && componentConfig.required.includes(childKey)
      const propChildPath = [...propPath, childKey]

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
            <Text color={textColor} isBold shouldHideOverflow>{childDisplayName}</Text>
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
