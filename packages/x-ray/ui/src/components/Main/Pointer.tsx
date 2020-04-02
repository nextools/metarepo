import React, { MouseEvent, ReactNode } from 'react'
import { normalizeStyle } from 'stili'
import { component, startWithType, mapHandlers, mapProps } from 'refun'
import { TRect } from '../../types'

export type TPointer = TRect & {
  children: ReactNode,
  onScroll: (scrollTop: number) => void,
  onPress: (x: number, y: number) => void,
}

const style = normalizeStyle({
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  borderStyle: 'solid',
  borderWidth: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

export const Pointer = component(
  startWithType<TPointer>(),
  mapHandlers({
    onScroll: ({ onScroll }) => (e: MouseEvent<HTMLDivElement>) => {
      onScroll(e.currentTarget.scrollTop)
    },
    onClick: ({ onPress }) => (e: MouseEvent<HTMLDivElement>) => {
      const { left, top } = e.currentTarget.getBoundingClientRect()

      onPress(e.pageX - left, e.pageY - top)
    },
  }),
  mapProps(({ left, top, width, height, children, onClick, onScroll }) => ({
    children,
    onClick,
    onScroll,
    style: {
      ...style,
      left,
      top,
      width,
      height,
    },
  }))
)((props) => (
  <div {...props} style={style}/>
))

Pointer.displayName = 'Pointer'
