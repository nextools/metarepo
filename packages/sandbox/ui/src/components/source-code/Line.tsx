import React, { Fragment } from 'react'
import { mapHovered, TMapHovered, component, mapHandlers, startWithType, mapWithProps, mapContext } from 'refun'
import { TPath } from 'syntx'
import { Button } from '@primitives/button'
import { TMetaFile } from 'autoprops'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreState, mapStoreDispatch } from '../../store'
import { selectElement } from '../../actions'
import { serializeSyntxPath, clampSyntxPath } from '../../utils'
import { ThemeContext } from '../themes'
import { Text } from './Text'

export type TLine = {
  path: TPath,
  index: number,
  componentMetaFile: TMetaFile,
} & TMapHovered

export const Line = component(
  startWithType<TLine>(),
  mapContext(ThemeContext),
  mapStoreState(({ selectedElementPath, themeName }) => ({
    selectedElementPath,
    themeName,
  }), ['selectedElementPath', 'themeName']),
  mapStoreDispatch,
  mapWithProps(({ selectedElementPath, path, componentMetaFile }) => {
    const serializedPath = serializeSyntxPath(clampSyntxPath(componentMetaFile, path))

    return ({
      serializedPath,
      isSelected: selectedElementPath === serializedPath,
    })
  }),
  mapWithProps(({ theme, themeName }) => ({
    backgroundColor: theme[themeName].foreground,
    lineNumberColor: theme[themeName].sourceBaseword,
  })),
  mapHandlers({
    onPress: ({ dispatch, serializedPath }) => () => dispatch(selectElement(serializedPath)),
  }),
  mapHovered
)(({
  children,
  isSelected,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onPress,
  index,
  backgroundColor,
  lineNumberColor,
}) => (
  <Fragment>
    {(isSelected || isHovered) && (<Background color={backgroundColor}/>)}
    <Block left={20} top={0}>
      <Text color={lineNumberColor}>
        {String(index).padStart(2, '0')}
      </Text>
    </Block>
    <Block left={50} top={0} right={0}>
      <Button onPress={onPress} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
        {children}
      </Button>
    </Block>
  </Fragment>
))
