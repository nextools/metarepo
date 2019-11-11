import React from 'react'
import { mapHovered, TMapHovered, component, mapHandlers, startWithType, mapWithProps } from 'refun'
import { Button } from '@primitives/button'
import { isDefined } from 'tsfn'
import { TLine as TSyntxLine } from 'syntx'
import { Background } from '../background'
import { Block } from '../block'
import { mapStoreDispatch } from '../../store'
import { selectElement } from '../../actions'
import { TTheme } from '../../types'
import { Text } from './Text'
import { LINE_HEIGHT } from './utils'
import { LineElement } from './LineElement'

export type TLine = {
  index: number,
  line: TSyntxLine,
  theme: TTheme,
  selectedElementPath: string,
} & TMapHovered

export const Line = component(
  startWithType<TLine>(),
  mapStoreDispatch,
  mapHovered,
  mapWithProps(({ theme, isHovered, selectedElementPath, line }) => ({
    backgroundColor: (isHovered || line.meta === selectedElementPath) ? theme.foreground : theme.foregroundTransparent,
    lineNumberColor: theme.sourceBaseword,
  })),
  mapHandlers({
    onPress: ({ dispatch, line }) => () => {
      if (isDefined(line.meta)) {
        dispatch(selectElement(line.meta))
      }
    },
  })
)(({
  line,
  onPointerEnter,
  onPointerLeave,
  onPress,
  index,
  backgroundColor,
  lineNumberColor,
  theme,
}) => (
  <Block left={0} top={index * LINE_HEIGHT} right={0} height={LINE_HEIGHT}>
    <Background color={backgroundColor}/>
    <Block left={20} top={0}>
      <Text color={lineNumberColor}>
        {String(index + 1).padStart(2, '0')}
      </Text>
    </Block>
    <Block left={50} top={0} right={0}>
      <Button
        onPress={onPress}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {line.elements.map((element, i) => (
          <LineElement
            key={i}
            type={element.type}
            theme={theme}
          >
            {element.value}
          </LineElement>
        ))}
      </Button>
    </Block>
  </Block>
))
