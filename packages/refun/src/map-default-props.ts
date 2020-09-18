import { UNDEFINED } from 'tsfn'
import type { TOptionalKeys } from 'tsfn'

export const mapDefaultProps = <P extends {}, K extends TOptionalKeys<P>> (defaultProps: { [k in K]: Exclude<P[k], undefined> }) =>
  (props: P): P & typeof defaultProps => {
    const mergedProps = { ...props } as any

    // eslint-disable-next-line guard-for-in
    for (const key in defaultProps) {
      if (props[key] === UNDEFINED) {
        mergedProps[key] = defaultProps[key]
      }
    }

    return mergedProps
  }
