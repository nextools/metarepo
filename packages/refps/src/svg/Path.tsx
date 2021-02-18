import type { FC, SVGProps } from 'react'

export const Path: FC<SVGProps<SVGPathElement>> = (props) => <path {...props}/>

Path.displayName = 'path'
