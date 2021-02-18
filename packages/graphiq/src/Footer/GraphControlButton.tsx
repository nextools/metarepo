import { Background } from '@revert/background'
import { ParentBlock } from '@revert/block'
import { Button as RevertButton } from '@revert/button'
import { Layout, Layout_Item, Layout_Spacer } from '@revert/layout'
import { LinearGradient } from '@revert/linear-gradient'
import { Shadow } from '@revert/shadow'
import { Text } from '@revert/text'
import { startWithType, mapHandlers, pureComponent, mapWithProps, mapRef, onUpdate } from 'refun'
import type { TGraphColors } from '../types'
import { printGraphValue, changeColorAlpha } from './utils'

export type TGraphControlButton = {
  colors: TGraphColors,
  graphName: string,
  graphDiff: number,
  selectedGraphName: string | null,
  onSelectGraph: (graphName: string) => void,
}

export const GraphControlButton = pureComponent(
  startWithType<TGraphControlButton>(),
  mapHandlers({
    onPress: ({ onSelectGraph, graphName }) => () => {
      onSelectGraph(graphName)
    },
  }),
  mapWithProps(({ graphDiff, graphName, selectedGraphName, colors }) => {
    const isSelected = graphName === selectedGraphName
    const isActive = selectedGraphName === null || isSelected
    const isPositive = graphDiff <= 0

    return ({
      shadowRadius: isSelected ? 12 : 1,
      backgroundColor: isActive ? 0xffffffff : 0xffffff80,
      diffTextColor: (
        isPositive && isActive ? 0x00aa00ff :
        isPositive ? 0x004400c0 :
        isActive ? 0xff0000ff :
        0xaa0000c0
      ),
      borderColor: isActive ? colors[0] : changeColorAlpha(colors[0], 0.5),
    })
  }),
  mapRef('onRef', null as HTMLDivElement | null),
  onUpdate(({ onRef, graphName, selectedGraphName }) => {
    const isSelected = graphName === selectedGraphName

    if (isSelected) {
      onRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, ['selectedGraphName'])
)(({
  onRef,
  colors,
  diffTextColor,
  backgroundColor,
  graphName,
  graphDiff,
  shadowRadius,
  onPress,
}) => (
  <Layout direction="vertical">
    <LinearGradient
      colors={[[colors[0], 0], [colors[1], 1]]}
      angle={90}
    />
    <Shadow color={colors[1]} blurRadius={shadowRadius}/>
    <Layout_Spacer height={8}/>
    <Layout_Item hPadding={20} vAlign="center">
      <ParentBlock onRef={onRef}>
        <RevertButton onPress={onPress}>
          <Background color={backgroundColor}/>
          <Layout spaceBetween={5}>
            <Layout_Item>
              <Text fontSize={14}>
                {graphName}
              </Text>
            </Layout_Item>
            <Layout_Item>
              <Text
                fontSize={14}
                fontWeight={700}
                color={diffTextColor}
              >
                {printGraphValue(graphDiff)}
              </Text>
            </Layout_Item>
          </Layout>
        </RevertButton>
      </ParentBlock>
    </Layout_Item>
  </Layout>
))

GraphControlButton.displayName = 'Button'
