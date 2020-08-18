import React from 'react'
import type { FC, SVGProps } from 'react'

export const Defs: FC<SVGProps<SVGDefsElement>> = (props) => <defs {...props}/>

Defs.displayName = 'Defs'
