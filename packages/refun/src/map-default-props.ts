export const mapDefaultProps = <T extends {}> (defaultProps: T) =>
  <P extends {}> (props: P): P & T => ({ ...defaultProps, ...props })
