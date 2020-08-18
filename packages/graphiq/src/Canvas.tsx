import { AnimationValue, easeInOutCubic } from '@revert/animation'
import React, { Fragment } from 'react'
import { component, startWithType, mapWithPropsMemo, mapWithProps } from 'refun'
import { Graph } from './Graph'
import { CANVAS_PADDING, CONTROLS_HEIGHT_TOP, PAGE_BACKGROUND } from './constants'
import type { TCanvas } from './types'

export const Canvas = component(
  startWithType<TCanvas>(),
  mapWithProps(({ width, height }) => ({
    width: width - CANVAS_PADDING * 2,
    height,
  })),
  mapWithPropsMemo(({ graphs, selectedGraph, hoveredGraph }) => ({
    graphs: graphs.map((graph) => {
      return {
        ...graph,
        isActive: selectedGraph === graph.key || hoveredGraph === graph.key || (selectedGraph == null && hoveredGraph === null),
      }
    }),
  }), ['graphs', 'selectedGraph', 'hoveredGraph']),
  mapWithPropsMemo(({ graphs }) => {
    const newGraphs = graphs.slice(0)

    newGraphs.sort((a) => {
      if (a.isActive) {
        return 1
      }

      return -1
    })

    return {
      graphs: newGraphs,
    }
  }, ['graphs'])
)(({
  graphs,
  height,
  monthsAgo,
  scale,
  selectedGraph,
  width,
  onHoverGraph,
  onSelectGraph,
  onSliderChange,
}) => (
  <Fragment>
    <svg
      style={{ position: 'absolute', left: CANVAS_PADDING, top: CONTROLS_HEIGHT_TOP }}
      width={width}
      height={height}
    >
      <rect
        x={0}
        y={0}
        width="100%"
        height={height}
        fill={PAGE_BACKGROUND}
        onClick={
        () => {
          onSelectGraph(null)
        }
      }
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
                colors={graph.colors}
                entries={graph.values}
                id={graph.key}
                isHovered={graph.isActive}
                key={`${graph.key}-${monthsAgo}`}
                monthsAgo={monthsAgo}
                width={width}
                height={height}
                scale={scale}
                isActive={selectedGraph === graph.key}
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
        left: width + 50,
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
