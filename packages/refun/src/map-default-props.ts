import { UNDEFINED, TOptionalKeys, getObjectKeys } from 'tsfn'

export const mapDefaultProps = <P extends {}, K extends TOptionalKeys<P>> (defaultProps: { [k in K]: Exclude<P[k], undefined> }) => {
  const defaultPropsKeys = getObjectKeys(defaultProps)

  return (props: P): P & typeof defaultProps => {
    const mergedProps = { ...props } as any

    for (const key of defaultPropsKeys) {
      const value = props[key]

      if (value === UNDEFINED) {
        mergedProps[key] = defaultProps[key]
      }
    }

    return mergedProps
  }
}
