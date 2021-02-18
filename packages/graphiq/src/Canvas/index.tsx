import { AnimationValue, easeInOutCubic } from '@revert/animation'
import { colorToString } from '@revert/color'
import { LayoutContext } from '@revert/layout'
import { Fragment } from 'react'
import { component, startWithType, mapContext, mapState, mapHandlers, onUpdate, mapWithProps } from 'refun'
import { CANVAS_PADDING, CONTROLS_HEIGHT_TOP, PAGE_BACKGROUND_COLOR } from '../constants'
import type { TGraphEntry } from '../types'
import { Graph } from './Graph'

export type TCanvas = {
  graphs: TGraphEntry[],
  selectedMonths: number,
  hoveredGraph: string | null,
  selectedGraph: string | null,
  onHoverGraph: (key: string | null) => void,
  onSelectGraph: (key: string | null) => void,
}

export const Canvas = component(
  startWithType<TCanvas>(),
  mapContext(LayoutContext),
  mapState('scale', 'setScale', () => 0, []),
  mapHandlers({
    onSliderChange: ({ setScale }) => (e) => {
      setScale(e.target.value)
    },
    onDeselect: ({ onSelectGraph }) => () => {
      onSelectGraph(null)
    },
  }),
  onUpdate(({ setScale }) => {
    setTimeout(() => {
      setScale(50)
    }, 200)
  }, []),
  mapWithProps(({ selectedGraph, hoveredGraph }) => ({
    shouldShowAllPaths: selectedGraph === null && hoveredGraph === null,
  }))
)(({
  graphs,
  _width,
  _height,
  selectedMonths,
  scale,
  selectedGraph,
  hoveredGraph,
  shouldShowAllPaths,
  onHoverGraph,
  onDeselect,
  onSelectGraph,
  onSliderChange,
}) => (
  <Fragment>
    <svg
      style={{ position: 'absolute', left: CANVAS_PADDING, top: CONTROLS_HEIGHT_TOP }}
      width={_width}
      height={_height}
    >
      <rect
        x={0}
        y={0}
        width="100%"
        height={_height}
        fill={colorToString(PAGE_BACKGROUND_COLOR)}
        onClick={onDeselect}
      />
      <AnimationValue
        easing={easeInOutCubic}
        time={200}
        toValue={scale}
      >
        {(scale) => (
          <Fragment>
            {graphs.map((graph) => (
              <Graph
                key={graph.graphName}
                id={graph.graphName}
                width={_width}
                height={_height}
                scale={scale}
                colors={graph.colors}
                entries={graph.values}
                selectedMonths={selectedMonths}
                isHovered={shouldShowAllPaths || hoveredGraph === graph.graphName}
                isSelected={selectedGraph === graph.graphName}
                onHover={onHoverGraph}
                onSelect={onSelectGraph}
              />
            ))}
          </Fragment>
        )}
      </AnimationValue>
    </svg>
    <input
      style={{
        position: 'absolute',
        width: 130,
        top: CONTROLS_HEIGHT_TOP + 100,
        left: _width + 50,
        transform: 'rotate(270deg)',
      }}
      type="range"
      min="10"
      max="100"
      value={scale}
      onChange={onSliderChange}
    />
  </Fragment>
))

Canvas.displayName = 'Canvas'
Canvas.componentKey = Symbol('CANVAS')
