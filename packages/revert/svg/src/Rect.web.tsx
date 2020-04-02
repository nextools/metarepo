import React, { FC, SVGProps } from 'react'

export const Rect: FC<SVGProps<SVGRectElement>> = (props) => <rect {...props}/>

Rect.displayName = 'Rect'
