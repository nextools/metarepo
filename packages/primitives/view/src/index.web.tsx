import React, { FC, HTMLAttributes } from 'react'

export const View: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props}/>
)

View.displayName = 'View'
