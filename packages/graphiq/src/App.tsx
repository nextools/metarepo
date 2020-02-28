import React from 'react'
import {
  component,
  mapDebouncedHandlerTimeout,
  mapHandlers,
  mapState,
  mapWithPropsMemo,
  onMount,
  startWithType,
} from 'refun'
import { Root } from '@primitives/root'
import { Canvas } from './Canvas'
import { Header, Footer } from './Controls/index'
import { TApp } from './types'
import { PAGE_BACKGROUND, CONTROLS_HEIGHT_TOP, CONTROLS_HEIGHT_BOTTOM } from './constants'

export const App = component(
  startWithType<TApp>(),
  mapState('scale', 'setScale', () => 0, []),
  mapState('monthsAgo', 'setMonthsAgo', () => 1, []),
  mapHandlers({
    onMonthsAgo: ({ setMonthsAgo }) => (months) => {
      setMonthsAgo(months)
    },
    onSliderChange: ({ setScale }) => (e) => {
      setScale(e.target.value)
    },
  }),
  onMount(({ setScale }) => {
    setTimeout(() => {
      setScale(50)
    }, 200)
  }),
  mapState('selectedGraph', 'setSelectedGraph', () => null, []),
  mapState('hoveredGraph', 'setHoveredGraph', () => null, []),
  mapHandlers(({
    onSelectGraph: ({ selectedGraph, setSelectedGraph, setHoveredGraph }) => (name) => {
      if (selectedGraph !== name) {
        setSelectedGraph(name)
        setHoveredGraph(name)
      }
    },
    onHoverGraph: ({ selectedGraph, setHoveredGraph }) => (id) => {
      if (selectedGraph === null) {
        setHoveredGraph(id)
      }
    },
  })),
  mapDebouncedHandlerTimeout('onHoverGraph', 100),
  mapWithPropsMemo(({ graphs }) => ({
    graphControls: graphs.map((graph) => {
      let lastDifference

      if (graph.values.length === 1) {
        lastDifference = 100
      } else {
        const lastValue = graph.values[graph.values.length - 1].value
        const preLastValue = graph.values[graph.values.length - 2].value

        lastDifference = Math.round((lastValue - preLastValue) / preLastValue * 100.0)
      }

      return {
        colors: graph.colors,
        key: graph.key,
        lastDifference,
        name: graph.key.replace(/[A-Z]/g, ' $&'),
      }
    }),
  }), ['graphs'])
)(({
  graphControls,
  graphs,
  hoveredGraph,
  monthsAgo,
  scale,
  selectedGraph,
  onHoverGraph,
  onSelectGraph,
  onSliderChange,
  onMonthsAgo,
}) => (
  <Root>
    {({ width, height }) => (
      <div style={{ background: PAGE_BACKGROUND, width, height, position: 'absolute' }}>
        <Header
          monthsAgo={monthsAgo}
          onMonthsAgo={onMonthsAgo}
        />
        <Canvas
          graphs={graphs}
          height={height - CONTROLS_HEIGHT_TOP - CONTROLS_HEIGHT_BOTTOM}
          hoveredGraph={hoveredGraph}
          monthsAgo={monthsAgo}
          scale={scale}
          selectedGraph={selectedGraph}
          width={width}
          onHoverGraph={onHoverGraph}
          onSelectGraph={onSelectGraph}
          onSliderChange={onSliderChange}
        />
        <Footer
          width={width}
          graphControls={graphControls}
          selectedGraph={selectedGraph}
          onSelectGraph={onSelectGraph}
        />
      </div>
    )}
  </Root>
))

App.displayName = 'App'
