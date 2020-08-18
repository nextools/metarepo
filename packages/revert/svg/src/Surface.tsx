import React from 'react'
import type { FC, SVGProps } from 'react'

export const Surface: FC<SVGProps<SVGSVGElement>> = (props) => <svg {...props}/>

Surface.displayName = 'Surface'
