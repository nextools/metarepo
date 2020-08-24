import React from 'react'
import type { FC, SVGProps } from 'react'

export const Stop: FC<SVGProps<SVGStopElement>> = (props) => <stop {...props}/>

Stop.displayName = 'Stop'
