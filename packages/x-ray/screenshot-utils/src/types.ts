import { ReactElement } from 'react' // eslint-disable-line

export type TMeta = {
  options: {
    name: string,
    hasOwnWidth?: boolean,
    negativeOverflow?: number,
    backgroundColor?: string,
    maxWidth?: number,
  },
  element: ReactElement<any>,
}
