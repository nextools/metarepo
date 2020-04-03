import React, { FC, SVGProps } from 'react'

export const Shape: FC<SVGProps<SVGPathElement>> = (props) => <path {...props}/>

Shape.displayName = 'Shape'
