import React from 'react'
import { component, startWithType, mapRef, onUpdate } from 'refun'
import { colorToString } from 'colorido'
import { TButton } from '../types'

export const Button = component(
  startWithType<TButton>(),
  mapRef('refButton', null as null | HTMLButtonElement),
  onUpdate(({ refButton, idKey, selectedGraph }) => {
    if (refButton.current !== null && selectedGraph === idKey) {
      refButton.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, ['selectedGraph'])
)(({
  colors,
  idKey,
  lastDifference,
  name,
  refButton,
  selectedGraph,
  onSelectGraph,
}) => (
  <button
    style={{
      background: 'white',
      border: 'none',
      borderWidth: 8,
      borderStyle: 'solid',
      borderBottom: 0,
      borderRight: 0,
      borderLeft: 0,
      borderImageSource: `linear-gradient(45deg, ${colorToString(colors[0])}, ${colorToString(colors[1])})`,
      borderImageSlice: 1,
      boxShadow: `0 0 ${selectedGraph === idKey ? 12 : 1}px ${colorToString(colors[0])}`,
      cursor: 'pointer',
      fontSize: 14,
      marginLeft: 20,
      opacity: !selectedGraph || selectedGraph === idKey ? 1 : 0.5,
      padding: '0px 15px',
      position: 'relative',
      height: 40,
      flexShrink: 0,
      textTransform: 'capitalize',
    }}
    ref={refButton}
    onClick={() => {
      onSelectGraph(idKey)
    }}
  >
    {name}{' '}
    <span style={{ fontWeight: 'bold', color: `${lastDifference > 0 ? 'red' : 'green'}` }}>
      ({lastDifference > 0 ? `+${lastDifference}` : lastDifference}%)
    </span>
  </button>
))

Button.displayName = 'Button'
