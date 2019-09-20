import { getObjectKeys, isUndefined } from 'tsfn'

export const mapDefaultProps = <T extends {}> (defaultProps: T) =>
  <P extends {}> (props: P): P & T => {
    const mergedProps = { ...defaultProps, ...props }

    // prevent undefined values to overwrite default props
    for (const key of getObjectKeys(props)) {
      if (isUndefined(mergedProps[key]) && Reflect.has(defaultProps, key)) {
        mergedProps[key] = (defaultProps as typeof mergedProps)[key]
      }
    }

    return mergedProps
  }
