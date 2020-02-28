import React, { FC } from 'react'
import { CONTROLS_HEIGHT_BOTTOM } from '../constants'
import { TFooterControls } from '../types'
import { Button } from './Button'

export const Footer: FC<TFooterControls> = ({
  graphControls,
  selectedGraph,
  width,
  onSelectGraph,
}) => (
  <div style={{
    display: 'flex',
    height: CONTROLS_HEIGHT_BOTTOM,
    position: 'absolute',
    bottom: 0,
    width,
  }}
  >
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        overflow: 'scroll',
      }}
    >
      {graphControls.map(({ key, name, colors, lastDifference }) => (
        <Button
          colors={colors}
          idKey={key}
          key={key}
          lastDifference={lastDifference}
          name={name}
          selectedGraph={selectedGraph}
          onSelectGraph={onSelectGraph}
        />
      ))}
    </div>
    <button
      style={{
        background: 'white',
        border: 'none',
        borderRadius: 0,
        cursor: 'pointer',
        fontSize: 14,
        marginLeft: 20,
        marginRight: 20,
        height: 30,
        alignSelf: 'center',
        opacity: selectedGraph ? 1 : 0.5,
        position: 'relative',
        flexShrink: 0,
      }}
      onClick={() => {
        onSelectGraph(null)
      }}
    >
      Show all
    </button>
  </div>
)

Footer.displayName = 'Footer'
