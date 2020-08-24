import React from 'react'
import type { FC, SVGProps } from 'react'

export const Ellipse: FC<SVGProps<SVGEllipseElement>> = (props) => <ellipse {...props}/>

Ellipse.displayName = 'Ellipse'
