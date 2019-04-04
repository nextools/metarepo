export type TExportsMap = {
  [k: string]: {
    exports: string[],
    default?: string
  }
}

export type TOptions = {
  setupFile: string,
  platform: 'android' | 'ios',
  exportsMap: TExportsMap
}
