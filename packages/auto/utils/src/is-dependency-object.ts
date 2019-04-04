export const isDependencyObject = (deps: any): deps is { [k: string]: string } => {
  return Object.prototype.toString.call(deps) === '[object Object]'
}
