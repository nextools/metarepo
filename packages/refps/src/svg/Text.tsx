import type { FC, SVGProps } from 'react'

export const Text: FC<SVGProps<SVGTextElement>> = (props) => <text {...props}/>

Text.displayName = 'Text'
