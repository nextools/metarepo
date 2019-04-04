export const mapProps = <P extends {}, R extends {}>(getFn: (props: P) => R) => (props: P): R => getFn(props)
