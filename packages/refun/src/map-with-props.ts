import { TExtend } from 'tsfn'

export const mapWithProps = <P extends {}, R extends {}>(getFn: (props: P) => R) => (props: P): TExtend<P, R> => {
  return {
    ...props,
    ...getFn(props),
  }
}

