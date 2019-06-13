import { getObjectKeys, isUndefined } from 'tsfn'

export const mapDefaultProps = <T extends {}> (defaultProps: T) =>
  <P extends {}> (props: P): P & T => {
    const mergedProps = { ...defaultProps, ...props }

    return getObjectKeys(props).reduce((result, key) => {
      if (isUndefined(result[key]) && Reflect.has(defaultProps, key)) {
        result[key] = (defaultProps as typeof mergedProps)[key]
      }

      return result
    }, mergedProps)
  }
