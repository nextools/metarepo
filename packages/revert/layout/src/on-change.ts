export const onChange = <P extends {}>(getFn: (props: P) => Promise<void> | void) => (props: P): P => {
  void getFn(props)

  return props
}
