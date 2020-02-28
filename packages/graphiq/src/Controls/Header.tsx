import React from 'react'
import { component, startWithType } from 'refun'
import { THeaderControls } from '../types'
import { CONTROLS_HEIGHT_TOP, BUTTON_FONT_SIZE } from '../constants'

const getButtonStyle = (month: number, currentMonth: number) => ({
  border: 'none',
  borderBottom: `2px solid ${month === currentMonth ? '#ffeb3b' : '#ccc'}`,
  background: 'none',
  color: 'white',
  cursor: 'pointer',
  fontSize: BUTTON_FONT_SIZE,
  height: 40,
  margin: '0 10px',
  padding: '0 14px',
})

export const Header = component(
  startWithType<THeaderControls>()
)(({
  monthsAgo,
  onMonthsAgo,
}) => (
  <div style={{
    display: 'flex',
    height: CONTROLS_HEIGHT_TOP,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <button
      style={getButtonStyle(1, monthsAgo)}
      onClick={() => {
        onMonthsAgo(1)
      }}
    >
      1 month
    </button>
    <button
      style={getButtonStyle(3, monthsAgo)}
      onClick={() => {
        onMonthsAgo(3)
      }}
    >
      3 months
    </button>
    <button
      style={getButtonStyle(6, monthsAgo)}
      onClick={() => {
        onMonthsAgo(6)
      }}
    >
      6 months
    </button>
  </div>
))

Header.displayName = 'Header'
